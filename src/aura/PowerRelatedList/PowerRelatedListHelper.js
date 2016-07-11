({
	//shared by lots of functions.  You give it a comma-separated list of stuff, it returns a trimmed array
	CSL2Array: function (CSL){

		var outputArray = CSL.split(",");
		_.forEach(outputArray, function (value, key){
			outputArray[key] = _.trim(value);
		});
		return outputArray;
	},

    getBudget: function (component){
        var action = component.get("c.query");
		action.setParams({"soql" : "select BudgetedCost from Campaign where Id='"+component.get("v.recordId")+"'"});
        action.setCallback(self, function(a){
        	console.log("query results");	
        	var records = JSON.parse(a.getReturnValue())
        	console.log(records);
        	component.set("v.budget", records[0].BudgetedCost);
        });
        $A.enqueueAction(action);
    },
    
    retotal: function(results){
		return _.sum(_.map(results, "Budget__c"));
    },
    
	query: function (component, soql){
        var self = this;
		var action = component.get("c.query");
		action.setParams({"soql" : soql});
        action.setCallback(self, function(a){
        	console.log("query results");	
        	var records = JSON.parse(a.getReturnValue())
        	console.log(records);
        	component.set("v.results", records);
            component.set("v.allocated", self.retotal(records));
        });
        $A.enqueueAction(action);        
	},

	describe: function (component, objectName){
        //	public static String describe(String objtype) {
		var action = component.get("c.describe");
        action.setParams({"objtype" : objectName }); 
        action.setCallback(this, function (a){
            console.log("result in callback:");
            var output = JSON.parse(a.getReturnValue());
            component.set("v.pluralLabel", output.objectProperties.pluralLabel);
            console.log(output.fields);
            //now, only get the ones that are in the displayfieldsList
            var fieldsArray = this.CSL2Array(component.get("v.displayFields"));
            var editableFields = this.CSL2Array(component.get("v.editableFields"));
            console.log(fieldsArray);
            var displayFieldsArray=[]
            _.forEach(fieldsArray, function(value){
            	//_.find(users, ['active', false]);
                var temp = {"describe" : _.find(output.fields, {"name" : value}) }
                //is it editable?
                if (_.includes(editableFields, value)){
                    temp.describe.editable=true;
                } else {
                    temp.describe.editable=false;
                }
                displayFieldsArray.push(
                    temp
                );      
            });
            console.log(displayFieldsArray);
            component.set("v.displayFieldsArray", displayFieldsArray);


        });
        $A.enqueueAction(action);

    }
})