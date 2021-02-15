// @ts-nocheck
sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

		return Controller.extend("ms.HTML5Module.controller.View1", {
			onInit: function () {

            },
            
            onAssignNewTask: function(oEvent){
               if (!this.dialog) {
                    this.dialog = sap.ui.xmlfragment("ms.HTML5Module.Fragments.CreateNewTaskMapping", this); 
                    var table = this.getView().byId("table")
                    this.dialog.setModel(table.getBinding("items").getModel());
                    this.dialog.bindElement({
                        path: table.getBinding("items").getPath()
                        });                
                  }
                  this.dialog.open();
            },

            onCancelPress : function(){
              this.dialog.close();
            },
            
            onSavePress : function(){
                //post call

                var oThis = this,
                    selectedProcessId = sap.ui.getCore().byId("ProcessComboBox").getSelectedKey(),
                    selectedScreeningTaskId = sap.ui.getCore().byId("ScreeningTaskComboBox").getSelectedKey(),
                    table = this.getView().byId("table"),
                    obj = {
                             processTypeID: selectedProcessId,
                             screeningTaskType_ID: selectedScreeningTaskId,
                          };
                    if( selectedProcessId !== "" && selectedScreeningTaskId !== ""){
                    jQuery.ajax({
                                 type: 'POST',
                                 contentType: 'application/json',
                                 url: "/msHTML5Module/bgcportal/api/v1/ProcessType",
                                 data: JSON.stringify(obj),
                                 success: function () {
                                     table.getBinding("items").getModel().refresh();
                                     oThis.dialog.close();
                                 },
                                 error: function (e) {
                                    if(e.responseJSON.error.message === "Entity already exists"){
                                      new sap.m.MessageToast.show("Mapping Already Exists!");
                                      oThis.dialog.close();
                                    }
                                    
                                    
                                 }
                     });
                }
               
            },

            onDeleteMapping : function(oEvent){
                //call to delete
                var  selectedProcessId = oEvent.getSource().getBindingContext().getObject().processTypeID,
                     selectedScreeningTaskId = oEvent.getSource().getBindingContext().getObject().screeningTaskType_ID,
                     table = this.getView().byId("table");
                     jQuery.ajax({
                                     type: 'DELETE',
                                     contentType: 'application/json',
                                     url: "/msHTML5Module/bgcportal/api/v1/ProcessType/" +  selectedProcessId +"/" + selectedScreeningTaskId,
                                     success: function () {
                                         table.getBinding("items").getModel().refresh();
                                         new sap.m.MessageToast.show("Mapping deleted successfully!");  
                                     },
                                     error: function (e) {
                                         console.log("error: " + JSON.stringify(e));
                                     }
                                 });
             }
    });
});
