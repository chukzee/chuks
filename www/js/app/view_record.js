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
                                pageId: "table-view-page-content",
                                pageTitle: "Banks",
                                headerTitle: "Showing Banks Added",
                                updateUrl: "php/update-bank.php",
                                deleteUrl: "php/delete-bank.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                uneditableColumns:["SN","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "BANK_NAME": "required"
                                },
                                validationMessages: {
                                    //"BANK_NAME": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });
        
        
        $("#monetary-show-bank-accounts-added").on("click", function () {

            ChurchApp.post("php/query-bank-account.php",
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
                                pageId: "table-view-page-content",
                                pageTitle: "Bank Accounts",
                                headerTitle: "Showing Bank Accounts Added",
                                updateUrl: "php/update-bank-account.php",
                                deleteUrl: "php/delete-bank-account.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                //do not allow edit of BANK_NAME here - that should be done in table that shows only bankks
                                uneditableColumns:["SN","BANK_NAME","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "BANK_NAME": "required",
                                    "ACCOUNT_NAME": "required",
                                    "ACCOUNT_NO": "required",
                                },
                                validationMessages: {
                                    //"BANK_NAME": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });
        
        
        $("#monetary-show-denominatios-added").on("click", function () {

            ChurchApp.post("php/query-denomination.php",
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
                                pageId: "table-view-page-content",
                                pageTitle: "Currency Demonminatios",
                                headerTitle: "Showing Currency Denominations Added",
                                updateUrl: "php/update-denomination.php",
                                deleteUrl: "php/delete-denomination.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                uneditableColumns:["SN","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "DENOMINATION": "required",
                                },
                                validationMessages: {
                                    //"DENOMINATION": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });
        
        $("#monetary-show-service-income-category-added").on("click", function () {

            ChurchApp.post("php/query-service-income-category.php",
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
                                pageId: "table-view-page-content",
                                pageTitle: "Service Income Categories",
                                headerTitle: "Showing Service Income Categories Added",
                                updateUrl: "php/update-service-income-category.php",
                                deleteUrl: "php/delete-service-income-category.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                uneditableColumns:["SN","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "SERVICE_INCOME_CATEGORY": "required"
                                },
                                validationMessages: {
                                    //"SERVICE_INCOME_CATEGORY": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });
        
        $("#monetary-show-income-category-added").on("click", function () {

            ChurchApp.post("php/query-income-category.php",
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
                                pageId: "table-view-page-content",
                                pageTitle: "Income Categories",
                                headerTitle: "Showing Income Categories Added",
                                updateUrl: "php/update-income-category.php",
                                deleteUrl: "php/delete-income-category.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                uneditableColumns:["SN","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "INCOME_CATEGORY": "required"
                                },
                                validationMessages: {
                                    //"INCOME_CATEGORY": "Please enter this field."
                                },
                            });
                                                        
                        }
                    },
                    function (data, r, error) {//fail

                    });

        });
        
                
        $("#monetary-show-expense-category-added").on("click", function () {

            ChurchApp.post("php/query-expense-category.php",
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
                                pageId: "table-view-page-content",
                                pageTitle: "Expense Categories",
                                headerTitle: "Showing Expenses Categories Added",
                                updateUrl: "php/update-expense-category.php",
                                deleteUrl: "php/delete-expense-category.php",
                                inactivityTimeout: 180,
                                useDefaultUneditables:true, //which are SN, ENTRY_USER_ID and ENTRY_DATETIME 
                                uneditableColumns:["SN","ENTRY_USER_ID","ENTRY_DATETIME",],
                                validationRules: {
                                    "EXPENSE_CATEGORY": "required"
                                },
                                validationMessages: {
                                    //"EXPENSE_CATEGORY": "Please enter this field."
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
         pageId: "table-view-page-content",
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