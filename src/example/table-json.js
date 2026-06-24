export const tableJSON = {
  type: 'doc',
  content: [
    {
      type: 'table',
      attrs: {
        margin: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 10,
                rowspan: 1,
                colwidth: [83, 0, 0, 33.33333333333333, 93, 25, 55, 34, 0, 0],
                style:
                  'border-top-color: #FFF;border-bottom-color: #FFF;border-left-color: #FFF;border-right-color: #FFF;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: '20pt',
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '18pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '测试数据',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 10,
                rowspan: 1,
                colwidth: [83, 0, 0, 33.33333333333333, 93, 25, 55, 34, 0, 0],
                style:
                  'border-left-color: #FFF;border-right-color: #FFF;border-bottom-color: #000;border-top-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: '11pt',
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '温馨提醒:为了购货方的合法权益得到有效保障,请详细阅读本单据购物须知，并确认单据内各项购物内容。',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: '11pt',
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '一经签字确认，将视同购货方对本单据所有内容均表示同意。              ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '8pt',
                          },
                        },
                      ],
                      text: '单号：$[umo.billno]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [83],
                style:
                  'border-top-color: #000;border-left-color: #000;border-bottom-color: #8E45D0;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '购货方',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 3,
                rowspan: 1,
                colwidth: [0, 0, 33.33333333333333],
                style: 'border-top-color: #000;border-bottom-color: #8E45D0;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.custname]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [93],
                style:
                  'border-top-color: #000;border-bottom-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '购货方电话',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 5,
                rowspan: 1,
                colwidth: [25, 55, 34, 0, 0],
                style:
                  'border-top-color: #000;border-right-color: #000;border-bottom-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.custtelephone]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [83],
                style:
                  'border-top-color: #8E45D0;border-bottom-color: #8E45D0;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '供货方',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 3,
                rowspan: 1,
                colwidth: [0, 0, 33.33333333333333],
                style:
                  'border-top-color: #8E45D0;border-bottom-color: #8E45D0;border-right-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.shopsname]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [93],
                style:
                  'border-top-color: rgba(230, 60, 206, 1);border-bottom-color: rgba(230, 60, 206, 1);border-left-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '供货方电话',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 5,
                rowspan: 1,
                colwidth: [25, 55, 34, 0, 0],
                style:
                  'border-top-color: rgba(230, 60, 206, 1);border-bottom-color: rgba(230, 60, 206, 1);border-right-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.createmobilephone]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [83],
                style:
                  'border-bottom-color: #4CAFEA;border-left-color: #4CAFEA;border-top-color: #8E45D0;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '定货日期',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 3,
                rowspan: 1,
                colwidth: [0, 0, 33.33333333333333],
                style:
                  'border-bottom-color: #4CAFEA;border-top-color: #8E45D0;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.billdate]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [93],
                style:
                  'border-bottom-color: #4CAFEA;border-top-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '送货时间',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 5,
                rowspan: 1,
                colwidth: [25, 55, 34, 0, 0],
                style:
                  'border-bottom-color: #4CAFEA;border-right-color: #4CAFEA;border-top-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.deliverydatestr]',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        margin: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [171, 0, 72, 0, 25, 25],
                style:
                  'border-top-color: #EB3323;border-bottom-color: #EB3323;border-left-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '宋体',
                            fontSize: '8.5pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '商品名称',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 31],
                style:
                  'border-left-color: #FFF;border-top-color: #EB3323;border-bottom-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '宋体',
                            fontSize: '8.5pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '规格型号',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 33],
                style:
                  'border-top-color: #EB3323;border-bottom-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '宋体',
                            fontSize: '8.5pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '零售价',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [36, 39],
                style:
                  'border-top-color: #EB3323;border-bottom-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '宋体',
                            fontSize: '8.5pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '数量',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style:
                  'border-top-color: #EB3323;border-bottom-color: #EB3323;border-right-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '宋体',
                            fontSize: '8.5pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '金额',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [171, 0, 72, 0, 25, 25],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.goodsname]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 31],
                style:
                  'border-left-color: #FFF;border-bottom-color: #000;border-top-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: ' $[umo.model]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 33],
                style: 'border-bottom-color: #000;border-top-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.actprice]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [36, 39],
                style: 'border-bottom-color: #000;border-top-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.qty]',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style: 'border-top-color: #EB3323;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                      ],
                      text: '$[umo.amount]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [171, 0, 72, 0, 25, 25],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 31],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 33],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [36, 39],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style: 'border-left-color: #000;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [171, 0, 72, 0, 25, 25],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 31],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 33],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [36, 39],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style: 'border-left-color: rgba(230, 60, 206, 1);',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: [171, 0, 72, 0, 25, 25],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 31],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 33],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [36, 39],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 1,
                rowspan: 1,
                colwidth: null,
                style: 'border-left-color: #4CAFEA;',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'right',
                    lineHeight: 1.75,
                    margin: null,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'table',
      attrs: {
        margin: null,
      },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 66],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '实售合计金额',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 9,
                rowspan: 1,
                colwidth: [25, 0, 0, 0, 0, 0, 25, 0, 0],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: 'white',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '$[umo.actamountCN]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 2,
                rowspan: 1,
                colwidth: [0, 66],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'center',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '本次付款金额',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableCell',
              attrs: {
                colspan: 9,
                rowspan: 1,
                colwidth: [25, 0, 0, 0, 0, 0, 25, 0, 0],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: 'left',
                    lineHeight: 1.75,
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: 'white',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '$[umo.prepaidamtCN]    ',
                    },
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '小写（￥）$[umo.prepaidamt]',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              attrs: {
                colspan: 11,
                rowspan: 1,
                colwidth: [0, 66, 25, 0, 0, 0, 0, 0, 25, 0, 0],
                style: '',
                align: null,
                background: null,
                color: null,
              },
              content: [
                {
                  type: 'paragraph',
                  attrs: {
                    wordWrap: 'normal',
                    indent: null,
                    indentUnit: null,
                    textAlign: null,
                    lineHeight: '115%',
                    margin: null,
                  },
                  content: [
                    {
                      type: 'text',
                      marks: [
                        {
                          type: 'textStyle',
                          attrs: {
                            backgroundColor: '',
                            color: '',
                            fontFamily: '微软雅黑, sans-serif',
                            fontSize: '9pt',
                          },
                        },
                        {
                          type: 'bold',
                        },
                      ],
                      text: '购销约定：',
                    },
                  ],
                },
                {
                  type: 'orderedList',
                  attrs: {
                    margin: null,
                    start: 1,
                    type: null,
                    listType: 'decimal',
                  },
                  content: [
                    {
                      type: 'listItem',
                      attrs: {
                        indent: null,
                        indentUnit: null,
                      },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            wordWrap: 'normal',
                            indent: null,
                            indentUnit: null,
                            textAlign: null,
                            lineHeight: 1.75,
                            margin: null,
                          },
                          content: [
                            {
                              type: 'text',
                              text: '若本次支付款项金额低于手机实际销售总金额的 20%，本次付款全额视作本次购机定金；若本次支付款项金额大于或等于手机实际销售总金额的 20%，统一按手机实际销售总金额的 20% 核定为本笔订单定金。',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      attrs: {
                        indent: null,
                        indentUnit: null,
                      },
                      content: [
                        {
                          type: 'paragraph',
                          attrs: {
                            wordWrap: 'normal',
                            indent: null,
                            indentUnit: null,
                            textAlign: null,
                            lineHeight: 1.75,
                            margin: null,
                          },
                          content: [
                            {
                              type: 'text',
                              text: '购货方（购机客户）与供货方（手机经销商 / 供货商）达成购销约定后，双方均需恪守履行本约定。若购货方单方面违约申请退机、取消订单或发生其他根本性违约行为，已支付定金不予退还；若供货方出现无货无法交付对应型号手机、单方拒单等根本性违约情形，需向购货方双倍返还已收取定金。若供货方逾期交付手机货品，购货方有权向供货方主张逾期违约金，违约金计算公式：逾期对应手机货款金额 ×0.3%× 逾期天数，违约金总额上限不得超过本订单定金金额。',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        wordWrap: 'normal',
        indent: null,
        indentUnit: null,
        textAlign: null,
        lineHeight: 1.75,
        margin: null,
      },
    },
  ],
}
