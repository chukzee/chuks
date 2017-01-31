


Ext.define('TradeAdmin.model.Broker', {
    extend: 'Ext.data.Model',

    alias: 'model.broker',

    fields: ['company', 'website', 'username', 'email', 'broker_admin_host_name', 'trade_platform_host_name','registered_by', 'date_registered'] //more fields may be included.
});

