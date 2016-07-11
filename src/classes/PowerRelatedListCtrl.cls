public with sharing class PowerRelatedListCtrl {
	
	@AuraEnabled
    public static string query(String soql) {
        return JSON.serialize(Database.query(soql));
    }

	@remoteAction @AuraEnabled
	public static String describe(String objtype) {
		// Just enough to make the sample app work!
		Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objtype);
		if (targetType == null) {
			return '[{"message":"The requested resource does not exist","errorCode":"NOT_FOUND"}]';
		}

		Schema.DescribeSObjectResult sobjResult = targetType.getDescribe();

		Map<String, Schema.SObjectField> fieldMap = sobjResult.fields.getMap();

		List<Object> fields = new List<Object>();
		for (String key : fieldMap.keySet()) {
			Schema.DescribeFieldResult descField = fieldMap.get(key).getDescribe();
			Map<String, Object> field = new Map<String, Object>();

			field.put('type', descField.getType().name().toLowerCase());
			field.put('name', descField.getName());
			field.put('label', descField.getLabel());
			List<String> references = new List<String>();
			for (Schema.sObjectType t : descField.getReferenceTo()) {
				references.add(t.getDescribe().getName());
			}
			if (!references.isEmpty()) {
				field.put('referenceTo', references);
			}

			fields.add(field);
		}

		Map<String, Object> result = new Map<String, Object>();
		result.put('fields', fields);

		map<string, string> objectProperties = new map<string, string>();
		objectProperties.put('pluralLabel', sobjResult.getLabelPlural());
		result.put('objectProperties', objectProperties);

		return JSON.serialize(result);
	}

	@AuraEnabled
    public static void updateField(id recordId, string Field, string newValue){
        system.debug(' in the update function');
        Schema.SObjectType sobjectType = recordId.getSObjectType();
        String sobjectName = sobjectType.getDescribe().getName();

        SObject record = Database.query('Select Id, ' + Field + ' From ' + sobjectName + ' Where Id = \'' + recordId + '\'');
        record.put(Field, decimal.valueOf(newValue));
        update record;
    }


}