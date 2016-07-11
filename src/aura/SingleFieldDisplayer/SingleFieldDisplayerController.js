({
	doInit : function(component, event, helper) {
		var record = component.get("v.record");
		var fieldDescribe = component.get("v.fieldDescribe");
		console.log(record);
		console.log(fieldDescribe);

		var output = record[fieldDescribe.describe.name];

		console.log(output);

		component.set("v.simpleOutput", output);
	},

	updateRecord: function(component, event, helper){
		console.log(event.target.value);
		//    public static void updateField(id recordId, string Field, string newValue){

		var action = component.get("c.updateField");
		var record=component.get("v.record");
		var fieldDescribe=component.get("v.fieldDescribe");

		console.log("recordId : " + record.Id);
		console.log("fieldName : " + fieldDescribe.describe.name);

        var params = {
			"recordId" : record.Id,
			"Field" : fieldDescribe.describe.name,
			"newValue" : event.target.value
		};
       
		action.setParams(params);

        action.setCallback(this, function(a){
        	console.log(a);        	
            //let's emit the event so the parent can hear it: recordId, field, newValue
            var appEvent = $A.get("e.c:PowerRelatedListChange");
            appEvent.setParams(params);
            appEvent.fire();
        });
        $A.enqueueAction(action);
	}
})