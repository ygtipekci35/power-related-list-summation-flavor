({
	doInit : function(component, event, helper) {
		//TODO: do a cleanup on displayFields parameter to make sure it's not invalid (commas, spaces, etc)
		
		//build the query
		var soql = "select Id, " + component.get("v.displayFields") + " from " + component.get("v.objectName") + " where " + component.get("v.lookupField") + " = '" + component.get("v.recordId") + "' order by Month__c";		
		console.log(soql);
		//get the describe
		helper.query(component, soql);            
		helper.getBudget(component);            
        helper.describe(component, component.get("v.objectName")); 
	},

	navToRecord : function(component, event){
    	console.log("nav invoked, get id first");

    	console.log(event.target);
    	var recordId = event.target.id;
    	console.log(recordId);

    	var navEvt = $A.get("e.force:navigateToSObject");
	    navEvt.setParams({
	      "recordId": recordId
	    });
	    navEvt.fire();
    },

    handleChange : function (component, event, helper){
    	var recordId = event.getParam("recordId");    
    	var Field = event.getParam("Field");    
    	var newValue = parseFloat(event.getParam("newValue"));    

        //update that row in this component's results
        var results = component.get("v.results");
        results[_.findIndex(results, { 'Id': recordId})][Field]=newValue;
        //recalc the total allocated
        component.set("v.allocated", helper.retotal(results));
    },
    
    createRecord : function (component, event, helper) {
	    var createRecordEvent = $A.get("e.force:createRecord");
	    createRecordEvent.setParams({
	        "entityApiName": component.get("v.objectName")
	    });
	    createRecordEvent.fire();
	}
})