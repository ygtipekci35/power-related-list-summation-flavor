@isTest
private class PowerRelatedListCtrlTest {
	
	@isTest static void testQuery() {
		PowerRelatedListCtrl.query('select id from case');
	}
	
	@isTest static void testDescribe() {
		PowerRelatedListCtrl.describe('Case');
	}
	
	@isTest static void testUpdate() {
		list<case> cases = [select id from Case];
		PowerRelatedListCtrl.updateField(cases[0].Id, 'Subject', 'your software REALLY sucks');
	}

	@testSetup static void methodName() {
        case c = new case();
        c.status = 'New';
        c.Subject = 'your software sucks';
        insert c;
    }
}