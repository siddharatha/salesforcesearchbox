  //standard functions

  $.expr[":"].containsNoCase = function(el, i, m) {
      var search = m[3];
      if (!search) return false;
      return eval("/" + search + "/i").test($(el).text());
  }


  // get parameter by name
  function getParameterByName(name,mylocation)
  {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(mylocation);
    if(results == null)
      return '';
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function SalesforceSearchBox(searchboxid) {
    this.searchboxid = searchboxid;
    this.searchelement = $('<p/>', {id: searchboxid});
  }


  function SalesforceURLManager(pages,sfclasses,triggers,sfcomponents,generalpage,generallist,rowcount){
    this.currenturl=$(location).attr('href');
    this.parametersurl=window.location.search;

      this.apexPagesrowVar=pages;
      this.apexClassesrowVar=sfclasses;
      this.triggersrowVar=triggers;
      this.componentsrowVar=sfcomponents;

      this.ingeneralrowVar=generalpage;
      this.ingenerallistVar=generallist;

      this.ingeneralrowVar = generalpage,
      this.ingenerallistVar = generallist
      this.noofrows = rowcount;
  }

  SalesforceURLManager.prototype.updateLinks=function(){
    var currentContext=this;
    if(getParameterByName('setupid',currentContext.parametersurl))
    {
      $('a[id*="_font"]').each(function(){
      var myHref=$(this).attr('href');
      if($(this).html()=='Apex Classes'){
        if(getParameterByName(currentContext.apexClassesrowVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.apexClassesrowVar)+'='+currentContext.noofrows);
      }
      else if($(this).html()=='Pages'){
        if(getParameterByName(currentContext.apexPagesrowVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.apexPagesrowVar)+'='+currentContext.noofrows);
      }
      else if($(this).html()=='Apex Triggers'){
        if(getParameterByName(currentContext.triggersrowVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.triggersrowVar)+'='+currentContext.noofrows);
      }
      else if($(this).html()=='Components'){
        if(getParameterByName(currentContext.componentsrowVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.componentsrowVar)+'='+currentContext.noofrows);
      }
      else{
        if(getParameterByName(currentContext.ingenerallistVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.ingenerallistVar)+'='+currentContext.noofrows);

        if(getParameterByName(currentContext.ingeneralrowVar,myHref) === '')
          $(this).attr('href',myHref+'&'+encodeURIComponent(currentContext.ingeneralrowVar)+'='+currentContext.noofrows);
      }
    });
  }
};

SalesforceSearchBox.prototype.resetSearch = function(){
      // clear the textbox
      $('#txtSearch').val('');
      // show all table rows
      $('table.list tr').show();
      // remove any no records rows
      $('.norecords').remove();
      // remove the cancel search image
      $('#imgSearch').hide();
      // make sure we re-focus on the textbox for usability
      $('#txtSearch').focus();
};

SalesforceSearchBox.prototype.search = function(){
  var currentContext=this;
      if ($('#txtSearch').val().length > 2) {
        // hide all rows
        $('table.list tr').hide();
        // show the header row
        $('table.list tr:first').show();
        // show the matching rows (using the containsNoCase from Rick Strahl)
        $('table.list tr td:containsNoCase(\'' +$('#txtSearch').val()+ '\')').parent().show();
        $('table.list tr th:containsNoCase(\'' +$('#txtSearch').val()+ '\')').parent().show();
      }
      else if ($('#txtSearch').val().length == 0) {
        // if the user removed all of the text, reset the search
        currentContext.resetSearch();
      }

      // if there were no matching rows, tell the user
      if ($('table.list tr:visible').length == 1) {
        // remove the norecords row if it already exists
        $('.norecords').remove();
        // add the norecords row
        $('table.list').append('<tr class="norecords"><td colspan="5" class="Normal">No records were found</td></tr>');
      }
  };

  SalesforceURLManager.prototype.isValidToShow=function(){
       if(this.currenturl.indexOf('setupid=')!=-1 && $('.setupBlock').length>0)
        return true;
      else
        return false;
  }

  SalesforceSearchBox.prototype.addToBody = function () {
  var currentContext=this;
      if ($('#' + currentContext.searchboxid).length === 0) {
        currentContext.searchelement.css({ "width" : "500px"}).html('<input type="text" id="txtSearch" name="txtSearch" maxlength="50" placeholder="Search" />');
        $('.setupBlock:first').parent().prepend(currentContext.searchelement);
         $('#txtSearch').focus();
         $('#txtSearch').keyup(function(event) {
            if (event.keyCode == 27) {
              currentContext.resetSearch();
            }
            if(event.keyCode==13){
              currentContext.search();
            }
          });
      }
  };


//events as follows
sfurlmanager = new SalesforceURLManager('j_id0:theTemplate:j_id8:rowsperpage','all_classes_page:theTemplate:classList:rowsperpage','all_triggers_page:theTemplate:j_id22:rowsperpage','j_id0:theTemplate:j_id8:rowsperpage','rowsperpage','rowsperlist',10000);
sfsearchbox = new SalesforceSearchBox('searchboxid_sid');

sfurlmanager.updateLinks();
if(sfurlmanager.isValidToShow())
  sfsearchbox.addToBody();
