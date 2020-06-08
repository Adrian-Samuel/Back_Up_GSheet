function back_up() {

    // getting access to spreadsheet via specified sheetID
    const sheet = SpreadsheetApp.openById(sheetID)

    // getting the values of filled fields skipping the first row
    const [_, headers, ...values] = sheet.getDataRange().getValues()

    //converting the rows into JSON for easier manipulation 
    const records = values.reduce((dataList, currentRow) => {
      const row = headers.reduce((dataDict, currentColumn, index) => {
            dataDict[currentColumn] = currentRow[index]
            return dataDict
        }, {})

      return [...dataList, row];
    }, [])

    // generating html using template strings
const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        table,
        tr,
        td,
        th {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 5px;
            text-align: center;
        }
    </style>
</head>

<body>
<h3> Here are your current list of volunteers </h3>
    <table>
        <thead>
            <tr>
            ${headers.reduce((headerString, currentHeader) => headerString+= `<th>${currentHeader}</th>` ,'')}
            </tr>
            <thead>
            <tbody>
            ${values.reduce((dataHTML, currentRow) =>{
                const row = Object.values(currentRow).reduce((htmlRow, currentRecord) =>  htmlRow += `<td>${currentRecord}</td>`,'')
                return dataHTML+= `<tr>${row}</tr>`;
            },'')}
            </tbody>

    </table>

</body>

</html>
`
// generating formatted date string for email subject
const hour = 1000 * 60 * 60;
const currentDateInMilliseconds = new Date().getTime()
const localISOTime = new Date(currentDateInMilliseconds - (hour * 4))
.toISOString()
.replace(/\.\w+/, "")
.replace(/T(\w+)/g, " at $1")

// sending email
GmailApp.sendEmail([arrayOfEmails], `Back_Up Listed dated: ${localISOTime}`, "", {
  htmlBody: html
})


}