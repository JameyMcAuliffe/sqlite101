'use strict'

const { Database } = require('sqlite3').verbose()
const cliTable = require('cli-table')

const db = new Database('db/Chinook_Sqlite.sqlite')


//Queries using sqlite3
// db.serialize(() => {
// 	db.all(`
// 		SELECT FirstName || ' ' || LastName AS 'Name', CustomerId, Country FROM Customer
// 		WHERE Country IS NOT 'USA'`
// 		, (err, customers) => {
// 			console.log(customers)
// 		})

// 	db.all(`
// 		SELECT FirstName || ' ' || LastName AS 'Name', CustomerId, Country FROM Customer
// 		WHERE Country IS 'Brazil'`
// 		, (err, customers) => {
// 			console.log(customers)
// 		})
// 	db.each(`
// 		SELECT FirstName || ' ' || LastName AS 'Name', Country, CustomerId FROM Customer
// 		WHERE Country IS 'Brazil'`
// 		, (err, { CustomerId, Name, Country }) => {
// 			console.log(`${CustomerId}: ${Name} (${Country})`)
// 	})

// 	db.each(`
// 		SELECT InvoiceId, FirstName || ' ' || LastName AS 'Name', InvoiceDate, BillingCountry
// 		FROM Invoice
// 		JOIN Customer ON Invoice.CustomerId = Customer.CustomerId
// 		WHERE Customer.Country = 'Brazil'`
// 		, (err, row) => {
// 			let table = new cliTable({
// 				head: ['Invoice Id', 'Name', 'Invoice Date', 'Billing Country'],
// 				colWidths: [25, 25, 25, 25]
// 			})
// 			table.push([row.InvoiceId, row.Name, row.InvoiceDate, row.BillingCountry])
// 			console.log(table.toString())
// 		})

// 	  db.all(`
//     SELECT FirstName || " " || LastName AS "Name",
//            InvoiceId,
//            InvoiceDate,
//            BillingCountry
//     FROM   Invoice
//     JOIN   Customer
//     ON     Invoice.CustomerId = Customer.CustomerId
//     WHERE  Country = "Brazil"
//   `, (err, invoices) => {
//     const head = ['InvoiceId', 'Name', 'InvoiceDate', 'BillingCountry']
//     const tbl = new cliTable({ head, style : { compact : true } })

//     tbl.push(...invoices.map(i => [i.InvoiceId, i.Name, i.InvoiceDate, i.BillingCountry]))
//     console.log(tbl.toString())
//   })

// 	{
//     // 4. Provide a query showing only the Employees who are Sales Agents.
//     const head = ['Name']
//     const tbl = new cliTable({ head, style: { compact: true } })

//     db.each(`
//         SELECT FirstName || " " || LastName AS "Name"
//         FROM   Employee
//         WHERE  Employee.Title = "Sales Support Agent"
//       `,
//       (err, emp) => tbl.push([emp.Name]),
//       () => console.log(tbl.toString())
//     )
//   }
// })

// db.close()

const knex = require('knex')({
	//client: 'sqlite3',
	client: 'pg',
	connection: 'postgres://localhost:5432/chinook',
  // connection: {
    //filename: 'db/Chinook_Sqlite.sqlite'
    
  // },
  //useNullAsDefault: false
})

//Queries using knex
// console.log('5) Provide a query showing a unique list of billing countries from the Invoice table.')
//knex.select('*').from('Invoice').then(console.log)
// knex('Invoice').distinct('BillingCountry').orderBy('BillingCountry').then(console.log)

// console.log('6) Provide a query showing the invoices of customers who are from Brazil.')
// knex('Invoice').where('BillingCountry', 'Brazil').then(console.log)

// console.log('7) Provide a query that shows the invoices associated with each sales agent. The resultant table should include the Sales Agents full name.')

// knex.select('Employee.FirstName as Sales Agent', 'Invoice.*')
// 	.from('Employee')
// 	.join('Customer', {'Employee.EmployeeId': 'Customer.SupportRepId'})
// 	.join('Invoice', {'Customer.CustomerId': 'Invoice.CustomerId'})
// 	.orderBy('Customer.SupportRepId')
// 	.then(console.log)

//postgres version, also works with sqlite3
console.log(`7. Provide a query that shows the invoices associated with each sales agent. The resultant table should include the Sales Agent's full name.`)
knex('Invoice')
  .select(knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" as SalesAgent`))
  .select('Invoice.*')
  .join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
  .join('Employee', 'SupportRepId', 'EmployeeId')
  .then(console.log)

// console.log('8) Provide a query that shows the Invoice Total, Customer name, Country and Sale Agent name for all invoices and customers.')

// knex('Invoice')
//   .select(knex.raw(`Employee.FirstName || ' ' || Employee.LastName as SalesAgent`))
//   .select(knex.raw(`Customer.FirstName || ' ' || Customer.LastName as Customer`))
//   .select('Customer.Country')
//   .sum('Invoice.Total as Total')
//   .join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
//   .join('Employee', 'SupportRepId', 'EmployeeId')
//   .groupBy('Customer.CustomerId')
//   .orderBy('Total', 'desc')
//   .then(console.log)

// knex.sum('Invoice.Total as Total').select('Customer.FirstName as Customer', 'Employee.FirstName as Sales Agent', 'Invoice.BillingCountry')
// .from('Employee')
// .join('Customer', {'Employee.EmployeeId': 'Customer.SupportRepId'})
// .join('Invoice', {'Customer.CustomerId': 'Invoice.CustomerId'})
// .groupBy('Customer.CustomerId')
// .then(console.log)

//postgres version, also works with sqlite3
knex('Invoice')
  .select(knex.raw(`"Employee"."FirstName" || ' ' || "Employee"."LastName" as SalesAgent`))
  .select(knex.raw(`"Customer"."FirstName" || ' ' || "Customer"."LastName" as Customer`))
  .select('Customer.Country')
  .sum('Invoice.Total as Total')
  .join('Customer', 'Invoice.CustomerId', 'Customer.CustomerId')
  .join('Employee', 'SupportRepId', 'EmployeeId')
  .groupBy('Customer.CustomerId', 'Employee.EmployeeId')
  .orderBy('Total', 'desc')
  .then(console.log)

knex.destroy()




