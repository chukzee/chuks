/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.apply(Ext.form.field.VTypes, Ext.create('TradeApp.ExtralVTypes'));

/**
 * Demonstrates usage of a border layout.
 */
Ext.define('TradeApp.view.main.Register', {
    extend: 'Ext.form.Panel',
    xtype: 'register',
    url: 'register',
    /*requires: [
     ],*/
    layout: 'center',
    //align:'center',
    width: 500,
    height: "100%",
    bodyBorder: false,
    frame: true,
    title: 'Register',
    bodyPadding: 10,
    scrollable: true,
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },

    items: [{
            xtype: "panel",
            layout: "vbox",
            title:'Create A Demo Account',
            items: [{
                    xtype: 'fieldset',
                    title: 'Your Login Information',
                    defaultType: 'textfield',
                    defaults: {
                        //anchor: '100%'
                    },
                    items: [
                        {
                            allowBlank: false,
                            fieldLabel: 'Username',
                            //emptyText: 'username',
                            name: 'username'
                        },
                        {
                            allowBlank: false,
                            fieldLabel: 'Password',
                            name: 'password',
                            id: 'register_password',
                            //emptyText: 'password',
                            inputType: 'password'
                        },
                        {
                            allowBlank: false,
                            fieldLabel: 'Password again',
                            //emptyText: 'password',
                            inputType: 'password',
                            vtype: 'passwordMatch',
                            initialPassField: 'register_password'
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    title: 'Your Contact Information',
                    style: 'background-color: white;',
                    defaultType: 'textfield',
                    defaults: {
                        //anchor: '100%'
                    },
                    items: [{
                            fieldLabel: 'First Name',
                            //emptyText: 'Your first name',
                            allowBlank: false,
                            name: 'first_name'
                        }, {
                            fieldLabel: 'Last Name',
                            //emptyText: 'Your last name',
                            allowBlank: false,
                            name: 'last_name'
                        }, {
                            fieldLabel: 'Email',
                            name: 'email',
                            //emptyText: 'Your email address',
                            allowBlank: false,
                            vtype: 'email'
                        }, {
                            xtype: 'combobox',
                            fieldLabel: 'Country',
                            name: 'country',
                            allowBlank: false,
                            store: ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic (CAR)', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Costa Rica', 'Cote d\'Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates (UAE)', 'United Kingdom (UK)', 'United States of America (USA)', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City (Holy See)', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia'],
                            valueField: 'country',
                            editable: false,
                            //typeAhead: true,
                            //emptyText: 'Select a country...',
                            queryMode: 'local'
                        }, {
                            xtype: 'numberfield',
                            allowBlank: false,
                            name: 'initial_deposit',
                            //emptyText: 'Initial deposit',
                            fieldLabel: 'Initial Deposit'
                        }]
                }, {
                    xtype: 'button',
                    text: 'Submit',
                    width: 200,
                    //formBind: true,//hmmm no need!
                    handler: function () {
                        var me = this;
                        if (this.isOperationInProgress === true) {
                            return;
                        }
                        var form = this.up('form'); // get the form panel
                        if (form.isValid()) { // make sure the form contains valid data before submitting
                            this.isOperationInProgress = true;
                            form.submit({
                                success: function (form, action) {
                                    me.isOperationInProgress = false;
                                    form.reset();//reset the form
                                    Ext.Msg.alert('Success', action.result.msg);
                                },
                                failure: function (form, action) {
                                    me.isOperationInProgress = false;
                                    Ext.Msg.alert('Failed', action.result.msg);
                                }
                            });
                        } else { // display error alert if the data is invalid
                            Ext.Msg.alert('Invalid input', 'Please correct errors.');
                        }
                    }
                }]
        }]

});