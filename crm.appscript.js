const me = {
  firstName: "Viola",
  lastName: "Cai",
};

// Main menu
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Customer Tools")
    .addItem("Send Email to Selected", "sendEmailToSelected")
    .addItem("Send Greeting Email", "sendGreetingEmail")
    .addItem("Send Mortgage Renewal Email", "sendMortgageRenewalEmail")
    .addItem(
      "Send Annual Financial Review Email",
      "sendAnnualFinancialReviewEmail"
    )
    .addItem("Send Email to All", "sendEmailToAll")
    .addItem(
      "Create Calendar Event for Selected",
      "createCalendarEventForSelected"
    )
    .addItem("Send Email & Create Event", "sendEmailAndCreateEvent")
    .addToUi();
}

function sendEmailToSelected() {
  const customers = getSelectedCustomers();

  if (customers.length != 1) {
    SpreadsheetApp.getUi().alert("Please select only one row.");
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const subjectResponse = ui.prompt(
    "Email Subject",
    "Enter email subject:",
    ui.ButtonSet.OK_CANCEL
  );

  if (subjectResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const bodyResponse = ui.prompt(
    "Email Body",
    "Email body ({name}/{company}/{email}/{phone}):",
    ui.ButtonSet.OK_CANCEL
  );

  if (bodyResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const subject = subjectResponse.getResponseText();
  const body = bodyResponse.getResponseText();

  sendEmail(customer, subject, body);
  ui.alert("Emails sent");
}

// Get customer data from sheet
function getCustomerData(row) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return {
    name: sheet.getRange(row, 1).getValue(),
    email: sheet.getRange(row, 2).getValue(),
    phone: sheet.getRange(row, 3).getValue(),
    company: sheet.getRange(row, 4).getValue(),
    row: row,
  };
}

// Get all customers
function getAllCustomers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const customers = [];

  for (let i = 2; i <= lastRow; i++) {
    const customer = getCustomerData(i);
    if (customer.email) {
      customers.push(customer);
    }
  }

  return customers;
}

// Get selected customers
function getSelectedCustomers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const selection = sheet.getActiveRange();
  const selectedRows = selection.getRow();
  const numRows = selection.getNumRows();
  const customers = [];

  for (let i = 0; i < numRows; i++) {
    const row = selectedRows + i;
    if (row > 1) {
      const customer = getCustomerData(row);
      if (customer.email) {
        customers.push(customer);
      }
    }
  }

  return customers;
}

function sendEmail(customer, subject, body) {
  try {
    GmailApp.sendEmail(customer.email, subject, body, {
      name: `${me.firstName}`,
      htmlBody: body.replace(/\n/g, "<br>"),
    });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(customer.row, 5).setValue("Sent");

    return true;
  } catch (error) {
    Logger.log("Error sending email to " + customer.email + ": " + error);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(customer.row, 5).setValue("Error: " + error.message);
    SpreadsheetApp.getUi().alert(
      "Error creating event for " + customer.name + ": " + error.message
    );
    return false;
  }
}

// Create calendar event function
function createCalendarEvent(
  customer,
  eventTitle,
  description,
  startDate,
  durationHours
) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const endDate = new Date(
      startDate.getTime() + durationHours * 60 * 60 * 1000
    );

    const event = calendar.createEvent(eventTitle, startDate, endDate, {
      description: description,
      guests: customer.email,
      sendInvites: true,
    });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet
      .getRange(customer.row, 6)
      .setValue("Event Created: " + new Date().toLocaleString());

    return event;
  } catch (error) {
    Logger.log("Error creating event for " + customer.email + ": " + error);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(customer.row, 6).setValue("Error: " + error.message);
    return null;
  }
}

function sendEmailToAll() {
  const customers = getAllCustomers();

  if (customers.length === 0) {
    SpreadsheetApp.getUi().alert("No customers found in the sheet.");
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    "Confirm",
    "Send email to all " + customers.length + " customers?",
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) {
    return;
  }

  const subjectResponse = ui.prompt(
    "Email Subject",
    "Enter email subject:",
    ui.ButtonSet.OK_CANCEL
  );

  if (subjectResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const bodyResponse = ui.prompt(
    "Email Body",
    "Enter email body (use {name}, {company} as placeholders):",
    ui.ButtonSet.OK_CANCEL
  );

  if (bodyResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const subject = subjectResponse.getResponseText();
  let bodyTemplate = bodyResponse.getResponseText();

  customers.forEach((customer) => {
    const body = bodyTemplate
      .replace(/{name}/g, customer.name)
      .replace(/{company}/g, customer.company)
      .replace(/{email}/g, customer.email)
      .replace(/{phone}/g, customer.phone);

    sendEmail(customer, subject, body);
  });

  ui.alert("Emails sent to " + customers.length + " customer(s).");
}

function createCalendarEventForSelected() {
  const customers = getSelectedCustomers();

  if (customers.length === 0) {
    SpreadsheetApp.getUi().alert(
      "Please select customer rows to create calendar events."
    );
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const titleResponse = ui.prompt(
    "Event Title",
    "Enter event title (use {name}, {company} as placeholders):",
    ui.ButtonSet.OK_CANCEL
  );

  if (titleResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const descResponse = ui.prompt(
    "Event Description",
    "Enter event description:",
    ui.ButtonSet.OK_CANCEL
  );

  if (descResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const dateResponse = ui.prompt(
    "Calendar Event Date",
    "Enter date and time (eg 2025-11-02T16:25):",
    ui.ButtonSet.OK_CANCEL
  );

  if (dateResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  const durationResponse = ui.prompt(
    "Duration",
    "Enter duration in hours (e.g., 1):",
    ui.ButtonSet.OK_CANCEL
  );

  if (durationResponse.getSelectedButton() !== ui.Button.OK) {
    return;
  }
  const customer = customers[0];
  const title = titleResponse
    .getResponseText()
    .replace(/{name}/g, customer.name)
    .replace(/{company}/g, customer.company);
  const description = descResponse.getResponseText();
  const startDate = new Date(dateResponse.getResponseText());
  const duration = parseFloat(durationResponse.getResponseText());

  createCalendarEvent(customer, title, description, startDate, duration);
  ui.alert("Calendar events created");
}

function sendEmailAndCreateEvent() {
  const customers = getSelectedCustomers();

  if (customers.length === 0) {
    SpreadsheetApp.getUi().alert("Please select customer rows.");
    return;
  }

  const ui = SpreadsheetApp.getUi();

  // Email prompts
  const subjectResponse = ui.prompt(
    "Email Subject",
    "Enter email subject:",
    ui.ButtonSet.OK_CANCEL
  );
  if (subjectResponse.getSelectedButton() !== ui.Button.OK) return;

  const bodyResponse = ui.prompt(
    "Email Body",
    "Enter email body (use {name}, {company} as placeholders):",
    ui.ButtonSet.OK_CANCEL
  );
  if (bodyResponse.getSelectedButton() !== ui.Button.OK) return;

  // Calendar prompts
  const titleResponse = ui.prompt(
    "Event Title",
    "Enter event title (use {name}, {company} as placeholders):",
    ui.ButtonSet.OK_CANCEL
  );
  if (titleResponse.getSelectedButton() !== ui.Button.OK) return;

  const descResponse = ui.prompt(
    "Event Description",
    "Enter event description:",
    ui.ButtonSet.OK_CANCEL
  );
  if (descResponse.getSelectedButton() !== ui.Button.OK) return;

  const dateResponse = ui.prompt(
    "Event Date",
    "Enter event date and time (e.g., 2025-11-15 10:00):",
    ui.ButtonSet.OK_CANCEL
  );
  if (dateResponse.getSelectedButton() !== ui.Button.OK) return;

  const durationResponse = ui.prompt(
    "Duration",
    "Enter duration in hours (e.g., 1):",
    ui.ButtonSet.OK_CANCEL
  );
  if (durationResponse.getSelectedButton() !== ui.Button.OK) return;

  const subject = subjectResponse.getResponseText();
  const bodyTemplate = bodyResponse.getResponseText();
  const titleTemplate = titleResponse.getResponseText();
  const description = descResponse.getResponseText();
  const startDate = new Date(dateResponse.getResponseText());
  const duration = parseFloat(durationResponse.getResponseText());

  customers.forEach((customer) => {
    const body = bodyTemplate
      .replace(/{name}/g, customer.name)
      .replace(/{company}/g, customer.company);

    const title = titleTemplate
      .replace(/{name}/g, customer.name)
      .replace(/{company}/g, customer.company);

    sendEmail(customer, subject, body);
    createCalendarEvent(customer, title, description, startDate, duration);
  });

  ui.alert(
    "Emails sent and calendar events created for " +
      customers.length +
      " customer(s)."
  );
}
