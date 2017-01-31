

Ext.define('TradeAdmin.model.DepositsAndWithdrawals', {
    extend: 'Ext.data.Model',

    alias: 'model.deposits-and-withdrawals',

    fields: ['date', 'type', 'details', 'amount'] //more fields may be included.
});
