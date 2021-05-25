const mockData = {
  loggedInUser: {

    access_token: '8293edfa-14b0-3d0a-90ba-b965b9ff44e5',
    // customerId: 'C5010445',
    // clm_servicenumber: '9900005046',
    // accountId: '40026452',
    customerId: 'C5010323',
    clm_servicenumber: '9900005007',
    accountId: '40026393',
    engagedPartyId: 'I114151',
    user : {
      userName : 'shaina.mosciski62@yahoo.com' , 
    },
    'shaina.mosciski62@yahoo.com': {
      customerId: 'C42370',
      clm_servicenumber: '9900006244'
    },
    '9900006244': {
      customerId: 'C5011723',
      clm_servicenumber: '9900006244'
    },
    '9900006245': {
      customerId: 'C5011724',
      clm_servicenumber: '9900006245'
    },
    '9900006189': {
      customerId: 'C5011690',
      clm_servicenumber: '9900006189'
    },
    '9900990099': {
      customerId: 'C5012093',
      clm_servicenumber: '9900990099'
    }
  },
  bills: [
    {
      id: 'FINV-050400001917-20',
      state: 'New',
      billNo: 'FINV-050400001917-20',
      billDate: '2020-04-30T00:00:00.000+0000',
      nextBillDate: '2020-05-01T00:00:00.000Z',
      paymentDueDate: '2020-04-05T00:00:00.000Z',
      billingPeriod: {
        startDateTime: '2020-03-01T00:00:00.000Z',
        endDateTime: '2020-03-31T00:00:00.000Z'
      },
      lastUpdate: '2020-05-05T05:07:29.214Z',
      amountDue: {
        value: '643.13'
      },
      remainingAmount: {
        value: '353.26'
      },
      taxIncludedAmount: {
        value: '643.13'
      },
      taxExcludedAmount: {
        value: '551.27'
      },
      taxAmount: {
        value: '91.86'
      },
      billingAccount: {
        id: '40026393',
        href: '',
        name: '',
        '@referredType': 'BillingAccount'
      }
    },
    {
      id: 'FINV-050400001918-20',
      state: 'New',
      billNo: 'FINV-050400001918-20',
      billDate: '2020-04-30T00:00:00.000+0000',
      nextBillDate: '2020-05-01T00:00:00.000Z',
      paymentDueDate: '2020-04-05T00:00:00.000Z',
      billingPeriod: {
        startDateTime: '2020-03-01T00:00:00.000Z',
        endDateTime: '2020-03-31T00:00:00.000Z'
      },
      lastUpdate: '2020-05-05T05:07:29.214Z',
      amountDue: {
        value: '643.13'
      },
      remainingAmount: {
        value: '353.26'
      },
      taxIncludedAmount: {
        value: '643.13'
      },
      taxExcludedAmount: {
        value: '551.27'
      },
      taxAmount: {
        value: '91.86'
      },
      billingAccount: {
        id: '40026393',
        href: '',
        name: '',
        '@referredType': 'BillingAccount'
      }
    },
    {
      id: 'FINV-050400001919-20',
      state: 'Paid',
      billNo: 'FINV-050400001919-20',
      billDate: '2020-04-30T00:00:00.000+0000',
      nextBillDate: '2020-05-01T00:00:00.000Z',
      paymentDueDate: '2020-04-05T00:00:00.000Z',
      billingPeriod: {
        startDateTime: '2020-03-01T00:00:00.000Z',
        endDateTime: '2020-03-31T00:00:00.000Z'
      },
      lastUpdate: '2020-05-05T05:07:29.214Z',
      amountDue: {
        value: '643.13'
      },
      remainingAmount: {
        value: '353.26'
      },
      taxIncludedAmount: {
        value: '643.13'
      },
      taxExcludedAmount: {
        value: '551.27'
      },
      taxAmount: {
        value: '91.86'
      },
      billingAccount: {
        id: '40026393',
        href: '',
        name: '',
        '@referredType': 'BillingAccount'
      }
    }
  ],
  billingDetails: {
    billStructure: {
      presentationMedia: {
        '@type': 'Post'
      }
    },
    contact: [
      {
        contactMedium: [
          {
            '@type': 'Post',
            characteristic: {
              email: 'user@mail.com',
              phoneNumber: '9900005046',
              street1: 'Lane-1',
              country: 'GH',
              city: 'Sans City',
              state: 'Sans'
            }
          },
          { type: 'EmailAddress', medium: { emailAddress: 'user@mail.com' } },
          { type: 'Number', characteristic: { contactNumber: '9900005046' } }
        ]
      }
    ]
  },
  payments: [
    {
      id: 'FINV-050400001916-20',
      paymentMethod: {
        '@type': 'Cash'
      },
      transactionDate: '2020-07-05T00:00:00.000Z',
      totalAmount: {
        value: 200,
        unit: 'GHS'
      }
    },
    {
      id: 'FINV-050400001917-21',
      paymentMethod: {
        '@type': 'Cash'
      },
      transactionDate: '2020-07-06T00:00:00.000Z',
      totalAmount: {
        value: 300,
        unit: 'GHS'
      }
    },
    {
      id: 'FINV-050400001919-22',
      paymentMethod: {
        '@type': 'Cash'
      },
      transactionDate: '2020-07-03T00:00:00.000Z',
      totalAmount: {
        value: 450,
        unit: 'GHS'
      }
    }
  ],
  corporateMenu: {
    customer: [
      {
        id: 'C42370',
        role: 'ProfileOwner',
        customerType: 'Organization',
        account: [
          {
            id: '416',
            product: [
              {
                id: 'PR64462',
                href: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/PR64462',
                isCustomerVisible: true,
                name: 'Plan 1',
                businessType: 'Postpaid',
                technology: 'GSM',
                relatedParty: [
                  {
                    role: 'csrAgent',
                    id: 'dapuser',
                    '@referredType': 'individual',
                    '@schemaLocation': '',
                    href: '',
                    name: 'dclmui'
                  },
                  {
                    role: 'Customer',
                    id: 'C42370',
                    '@referredType': 'Customer',
                    '@schemaLocation': '',
                    href: '',
                    engagedParty: {
                      id: 'O4570',
                      '@referredType': 'Organization',
                      '@schemaLocation': '',
                      href: ''
                    }
                  }
                ],
                billingAccount: {
                  name: 'Coca Cola India',
                  id: '416',
                  '@schemaLocation': '',
                  href: ''
                },
                path: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product',
                '@baseType': 'Product',
                '@type': 'Product',
                '@schemaLocation': 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/schema',
                LoB: 'Mobile'
              }
            ]
          }
        ],
        product: [
          {
            id: 'PR64464',
            href: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/PR64464',
            isCustomerVisible: false,
            relatedParty: [
              {
                role: 'csrAgent',
                id: 'dapuser',
                '@referredType': 'individual',
                '@schemaLocation': '',
                href: '',
                name: 'dclmui'
              },
              {
                role: 'Customer',
                id: 'C42370',
                '@referredType': 'Customer',
                '@schemaLocation': '',
                href: '',
                engagedParty: {
                  id: 'O4570',
                  '@referredType': 'Organization',
                  '@schemaLocation': '',
                  href: ''
                }
              }
            ],
            path: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product',
            '@baseType': 'Product',
            '@type': 'Product',
            '@schemaLocation': 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/schema'
          }
        ],
        children: [
          {
            id: 'C42371',
            account: [
              {
                id: '418',
                product: [
                  {
                    id: 'PR64465',
                    href: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/PR64465',
                    isCustomerVisible: true,
                    name: 'USSD 500 TPS',
                    technology: 'USSD',
                    relatedParty: [
                      {
                        role: 'csrAgent',
                        id: 'dapuser',
                        '@referredType': 'individual',
                        '@schemaLocation': '',
                        href: '',
                        name: 'dclmui'
                      },
                      {
                        role: 'Customer',
                        id: 'C42371',
                        '@referredType': 'Customer',
                        '@schemaLocation': '',
                        href: '',
                        engagedParty: {
                          id: 'O4571',
                          '@referredType': 'Organization',
                          '@schemaLocation': '',
                          href: ''
                        }
                      }
                    ],
                    billingAccount: {
                      name: 'Coca Cola Marashta',
                      id: '418',
                      '@schemaLocation': '',
                      href: ''
                    },
                    path: 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product',
                    '@baseType': 'Product',
                    '@type': 'Product',
                    '@schemaLocation': 'http://dclm.cluster1.devtestlab2.tecnotree.com//v1/product/schema',
                    LoB: 'DigitalServices'
                  }
                ]
              }
            ],
            product: []
          },
          {
            customerCode: 'C42372',
            accounts: [
              {
                accountCode: '419',
                products: []
              }
            ],
            products: []
          }
        ]
      }
    ],
    access_token: '5b25baa4-71a9-3e32-8c28-5937fef0aae4'
  }
};

export default mockData;
