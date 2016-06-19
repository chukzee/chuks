/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function () {

    $(document).on("pagecreate", function () {

        $("#monetary-show-banks-added").on("click", function () {

            ChurchApp.post("php/query-bank.php",
                    {
                    },
                    function (data) {//done
                        alert(data);
                        var json = JSON.parse(data);
                        if (json.status === "success") {
                            ChurchApp.changeAndRenderTablePage({
                                tableTitle: json.data.table_title,
                                tableColumns: json.data.table_columns,
                                tableData: json.data.table_data,
                                style: ChurchApp.DisplayStyle.A,
                                pageId: "table-view-page",
                                pageTitle: "Banks",
                                headerTitle: "Showing Banks Added",
                                updateUrl: "php/update-bank.php",
                                deleteUrl: "php/delete-bank.php",
                                inactivityTimeout: 180,
                                validationRules: {
                                    //"COS_1": "required"
                                },
                                validationMessages: {
                                    //"COS_1": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });

    });

    $(document).on("pagecreate", "#table-view-page", function () {
        //alert("demo");

        /*$.ajax({
         type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
         url: 'php/TestTable.php', // the url where we want to POST
         data: "", // our data object
         //dataType: 'json' // what type of data do we expect back from the server
         })
         // using the done promise callback
         .done(function (data) {
         //alert(data);
         var json = JSON.parse(data);
         if (json.status === "success") {
         this.tableData = "";
         
         ChurchApp.renderTablePage({
         tableTitle: json.data.table_title,
         tableColumns: json.data.table_columns,
         tableData: json.data.table_data,
         style: ChurchApp.DisplayStyle.A,
         pageId: "table-view-page",
         pageTitle: "Page Title",
         headerTitle: "Page Header Title",
         updateUrl: "#",
         deleteUrl: "#",
         inactivityTimeout: 180,
         validationRules: {
         "COS_1": "required"
         },
         validationMessages: {
         "COS_1": "Please enter this field."
         },
         });
         
         }
         })
         // using the fail promise callback
         .fail(function (data, r, error) {
         
         });*/
    });


    $(document).on("pagecreate", "#account-reconcile-page", function () {
        //login validation
        $("#account-reconcile-form").validate({
            //validation rules
            rules: {
                account_reconcile_bank: "required",
                account_reconcile_account_name: "required",
                account_reconcile_account_no: "required",
                account_reconcile_month_year: "required"
            },
            //custom validation message
            messages: {
            },
            //submit login form
            submitHandler: function (form) {

                ChurchApp.postForm(form,
                        function (data) {//done
                            var json = JSON.parse(data);

                            ChurchApp.renderAccountReconcile({
                                pageId: "account-reconcile-page", //must be the page id

                                cashBookColumns: json.data.cash_book.columns,
                                cashBookData: json.data.cash_book.table_data,
                                cashBookBalanceBF: json.data.cash_book.balance_bf,
                                bankStatementData: json.data.bank_statement.table_data,
                                bankStatementColumns: json.data.source_columns,
                                bankStatementBalanceBF: json.data.bank_statement.balance_bf,
                                dataRenderDiv: "reconcile-transaction-render", //can be the div it self or the div id - where cash book, statement and reconciliation statement will be renderred

                                reconcileTransactionButton: "radio-choice-h-6a", //can be the button (but preferrably radio) itself or the id - click to show reconciliation statement
                                missingTransactionButton: "radio-choice-h-6b", //can be the button (but preferrably radio) itself or the id - click to show missing transactions
                                unknownTransactionButton: "radio-choice-h-6c", //can be the button (but preferrably radio) itself or the id - click to show unknown transactions
                                conflictingTransactionButton: "radio-choice-h-6d", //can be the button (but preferrably radio) itself or the id - click to show conficting transactions

                                bank: json.data.bank,
                                accountName: json.data.account_name,
                                accountNo: json.data.account_no,
                                statementPeriod: json.data.statement_period,
                            });

                        },
                        function (data, r, error) {//fail
                            alert("error");
                        });
            }

        });
    });

});