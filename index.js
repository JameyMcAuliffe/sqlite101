'use strict'

const { Database } = require('sqlite3').verbose()
const cliTable = require('cli-table')

const db = new Database('db/Chinook_Sqlite.sqlite')


db.serialize(() => {
	// db.all(`
	// 	SELECT FirstName || ' ' || LastName AS 'Name', CustomerId, Country FROM Customer
	// 	WHERE Country IS NOT 'USA'`
	// 	, (err, customers) => {
	// 		console.log(customers)
	// 	})

	// db.all(`
	// 	SELECT FirstName || ' ' || LastName AS 'Name', CustomerId, Country FROM Customer
	// 	WHERE Country IS 'Brazil'`
	// 	, (err, customers) => {
	// 		console.log(customers)
	// 	})
	// db.each(`
	// 	SELECT FirstName || ' ' || LastName AS 'Name', Country, CustomerId FROM Customer
	// 	WHERE Country IS 'Brazil'`
	// 	, (err, { CustomerId, Name, Country }) => {
	// 		console.log(`${CustomerId}: ${Name} (${Country})`)
	// })

	// db.each(`
	// 	SELECT InvoiceId, FirstName || ' ' || LastName AS 'Name', InvoiceDate, BillingCountry
	// 	FROM Invoice
	// 	JOIN Customer ON Invoice.CustomerId = Customer.CustomerId
	// 	WHERE Customer.Country = 'Brazil'`
	// 	, (err, row) => {
	// 		let table = new cliTable({
	// 			head: ['Invoice Id', 'Name', 'Invoice Date', 'Billing Country'],
	// 			colWidths: [25, 25, 25, 25]
	// 		})
	// 		table.push([row.InvoiceId, row.Name, row.InvoiceDate, row.BillingCountry])
	// 		console.log(table.toString())
	// 	})

	  db.all(`
    SELECT FirstName || " " || LastName AS "Name",
           InvoiceId,
           InvoiceDate,
           BillingCountry
    FROM   Invoice
    JOIN   Customer
    ON     Invoice.CustomerId = Customer.CustomerId
    WHERE  Country = "Brazil"
  `, (err, invoices) => {
    const head = ['InvoiceId', 'Name', 'InvoiceDate', 'BillingCountry']
    const tbl = new cliTable({ head, style : { compact : true } })

    tbl.push(...invoices.map(i => [i.InvoiceId, i.Name, i.InvoiceDate, i.BillingCountry]))
    console.log(tbl.toString())
  })

	{
    // 4. Provide a query showing only the Employees who are Sales Agents.
    const head = ['Name']
    const tbl = new cliTable({ head, style: { compact: true } })

    db.each(`
        SELECT FirstName || " " || LastName AS "Name"
        FROM   Employee
        WHERE  Employee.Title = "Sales Support Agent"
      `,
      (err, emp) => tbl.push([emp.Name]),
      () => console.log(tbl.toString())
    )
  }
 })

db.close()

