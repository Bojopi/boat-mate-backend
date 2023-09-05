
export const nextOrderNumber = async () => {
    let newNumber;
    await Invoice.findOne({
        attributes: [
          [sequelize.fn('max', sequelize.col('id')), 'max_id']
        ]
      })
      .then(result => {
        const lastInvoiceId = result.get('max_id');
        newNumber = lastInvoiceId + 1;
    });
    
    console.log('Último ID de factura + 1:', newNumber);
    return newNumber
}