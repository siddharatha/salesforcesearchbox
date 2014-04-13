  /************************************************************************************
  This is your Page Code. The appAPI.ready() code block will be executed on every page load.
  For more information please visit our wiki site: http://crossrider.wiki.zoho.com
*************************************************************************************/

appAPI.ready(function($) {	    
  if (!appAPI.isMatchPages("*.salesforce.com/*")) return;
  //if (!appAPI.isMatchPages("*.salesforce.com/*setupid=")) return;
  if (appAPI.isMatchPages("*.salesforce.com/005*")) return;
  
  
  var url=$(location).attr('href');
  
  var apexPagesrowVar='j_id0:theTemplate:j_id8:rowsperpage';  
  var apexClassesrowVar='all_classes_page:theTemplate:classList:rowsperpage';
  var triggersrowVar='all_triggers_page:theTemplate:j_id22:rowsperpage';
  var componentsrowVar='j_id0:theTemplate:j_id8:rowsperpage';
  
  var ingeneralrowVar='rowsperpage';
  var ingenerallistVar='rowsperlist'; 
  
  var noofrows=10000;
  
  
  
  function getParameterByName(name,mylocation)
  {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(mylocation);
    if(results == null)
      return "";
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
  
  //making sure the page reloads
    if(getParameterByName('setupid',window.location.search)!=='')
  {
    $('a[href*="&setupid="]').each(function(){
      var myHref=$(this).attr('href');
      if($(this).html()=='Apex Classes'){        
        if(getParameterByName(apexClassesrowVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(apexClassesrowVar)+'='+noofrows);
      }                        
      else if($(this).html()=='Pages'){
        if(getParameterByName(apexPagesrowVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(apexPagesrowVar)+'='+noofrows);
      }
      else if($(this).html()=='Apex Triggers'){
        if(getParameterByName(triggersrowVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(triggersrowVar)+'='+noofrows);
      }
      else if($(this).html()=='Components'){
        if(getParameterByName(componentsrowVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(componentsrowVar)+'='+noofrows);
      }
      else{      
        if(getParameterByName(ingenerallistVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(ingenerallistVar)+'='+noofrows);  
          
        if(getParameterByName(ingeneralrowVar,myHref)==='')
          $(this).attr('href',myHref+'&'+encodeURIComponent(ingeneralrowVar)+'='+noofrows);  
      }    
    });    
  }
  
  
  //display search
  if(url.indexOf('setupid=')!=-1 && $('.setupBlock').length>0){    
  
    $.expr[":"].containsNoCase = function(el, i, m) {
      var search = m[3];
      if (!search) return false;
      return eval("/" + search + "/i").test($(el).text());
    };
    
    var s='<p class="special" style="width:500px;"><span style="font-weight:bold;">Search:</span> <input type="text" id="txtSearch" name="txtSearch" maxlength="50" />&nbsp;            <img id="imgSearch" src="http://files.softicons.com/download/system-icons/human-o2-grunge-icons-by-aleksandra-wolska/png/24x24/actions/edit-clear.png" alt="Cancel Search" title="X" /><button class="autocompletebutton">';
		if(appAPI.db.get('autocomplete')!=null)
		{
			if(appAPI.db.get('autocomplete')=='true')
			s+='Disable Autocomplete';
			
			else if(appAPI.db.get('autocomplete')=='false')			
			s+='Enable Autocomplete';;			
		}
		else
		{
			appAPI.db.set('autocomplete','true');
			s+='Disable Autocomplete';
		}	
	s+='</button></p>';    
    $('.setupBlock:first').parent().prepend(s);
    //just to make sure its easy for u to find it
    $('#txtSearch').focus();
    // used for the first example in the blog post
    //$('li:contains(\'DotNetNuke\')').css('color', '#0000ff').css('font-weight', 'bold');
    
    // hide the cancel search image
    $('#imgSearch').hide();
    
    // reset the search when the cancel image is clicked
    $('#imgSearch').click(function() {
      resetSearch();
    });
		
    
    // cancel the search if the user presses the ESC key
    $('#txtSearch').keyup(function(event) {
      if (event.keyCode == 27) {
        resetSearch();
      }
    }); 
    
	$('.autocompletebutton').click(function(event){		
		if(appAPI.db.get('autocomplete')!=null)
		{
			if(appAPI.db.get('autocomplete')=='true'){
			appAPI.db.set('autocomplete','false');
			$(this).html('Enable Autocomplete');
			}
			else if(appAPI.db.get('autocomplete')=='false'){
			appAPI.db.set('autocomplete','true');			
			$(this).html('Disable Autocomplete');
			}
		}
		else
		{
			appAPI.db.set('autocomplete','false');			
			$(this).html('Enable Autocomplete');
		}
		
	});
	
    // execute the search              
    $('#txtSearch').keyup(function(event) {
		if(appAPI.db.get('autocomplete')!=null)
		{
			if(appAPI.db.get('autocomplete')=='true')
			processSearch();              
			else
			{
				if(event.keyCode == 13)
				processSearch();              
			}
		}
		else
		{
			appAPI.db.set('autocomplete','true');
			processSearch();              
		}
				
    });
    // only search when there are 3 or more characters in the textbox
    
    
    function resetSearch() {
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
    }
    function processSearch(){     
      if ($('#txtSearch').val().length > 2) {
        // hide all rows
        $('table.list tr').hide();
        // show the header row
        $('table.list tr:first').show();
        
        // show the matching rows (using the containsNoCase from Rick Strahl)                 
        $('table.list tr td:containsNoCase(\'' +$('#txtSearch').val()+ '\')').parent().show();             
        $('table.list tr th:containsNoCase(\'' +$('#txtSearch').val()+ '\')').parent().show();
        
        // show the cancel search image
        $('#imgSearch').show();
      }
      else if ($('#txtSearch').val().length == 0) {
        // if the user removed all of the text, reset the search
        resetSearch();
      }
      
      // if there were no matching rows, tell the user
      if ($('table.list tr:visible').length == 1) {
        // remove the norecords row if it already exists
        $('.norecords').remove();
        // add the norecords row
        $('table.list').append('<tr class="norecords"><td colspan="5" class="Normal">No records were found</td></tr>');
      }
    }
    
  }
  
  
  
});
