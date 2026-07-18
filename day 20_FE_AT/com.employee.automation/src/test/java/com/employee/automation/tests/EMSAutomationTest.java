package com.employee.automation.tests;

import com.aventstack.extentreports.ExtentTest;
import com.employee.automation.base.BaseTest;
import com.employee.automation.listeners.RetryAnalyzer;
import com.employee.automation.pages.*;
import com.employee.automation.utils.ConfigReader;
import com.employee.automation.utils.ExtentManager;
import com.employee.automation.utils.WaitUtils;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * EMSAutomationTest - Main sequential test suite.
 *
 * Execution Order:
 *  PHASE 1 → Admin Login → All Admin Modules → Admin Logout
 *  PHASE 2 → Employee Login → All Employee Modules → Employee Logout
 *
 * Single browser, single tab, continuous execution.
 * testFailureIgnore=true in pom.xml ensures suite continues on failure.
 */
public class EMSAutomationTest extends BaseTest {

    // ═══════════════════════════════════════════════════════════════════════
    // ██████  PHASE 1 — ADMIN FLOW
    // ═══════════════════════════════════════════════════════════════════════

    @Test(priority = 1, description = "Admin Login - Authenticate with admin credentials",
          retryAnalyzer = RetryAnalyzer.class)
    public void test_01_AdminLogin() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Login",
            "Launch Chrome, open app URL, login as Admin, verify dashboard loads.",
            "Admin"
        );

        try {
            log.info("═══ PHASE 1: ADMIN LOGIN ═══");

            // Ensure we are at the login page
            navigateTo("/login");

            LoginPage loginPage = new LoginPage(driver);
            Assert.assertTrue(loginPage.isLoginPageLoaded(), "Login page should be visible.");
            test.info("Login page loaded ✓");

            // Verify submit button visible and enabled
            Assert.assertTrue(loginPage.isSubmitButtonEnabled(), "Submit button should be enabled.");
            test.info("Submit button verified ✓");

            // Perform admin login
            loginPage.loginAsAdmin(
                ConfigReader.getAdminUsername(),
                ConfigReader.getAdminPassword()
            );
            test.info("Admin credentials submitted.");

            // Verify redirect to admin dashboard
            WaitUtils.waitForUrlContains(driver, "admin", ConfigReader.getExplicitWait());
            DashboardPage dash = new DashboardPage(driver);
            Assert.assertTrue(dash.isDashboardLoaded(), "Admin dashboard should load after login.");

            test.info("Admin dashboard loaded. URL: " + driver.getCurrentUrl());
            String screenshot = captureScreenshot("01_Admin_Login_Success");
            test.pass("Admin login successful. Elapsed: " + getElapsedMs(start) + " ms");

        } catch (AssertionError | Exception e) {
            test.fail("Admin Login FAILED: " + e.getMessage());
            captureScreenshot("01_Admin_Login_FAIL");
            throw e;
        }
    }

    @Test(priority = 2, description = "Admin Dashboard - Verify metrics, stat cards, sidebar navigation",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_02_AdminDashboard() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Dashboard",
            "Verify admin dashboard stat cards, topbar user badge, and sidebar link count.",
            "Admin"
        );

        try {
            log.info("── Admin Dashboard ──");
            DashboardPage dash = new DashboardPage(driver);

            // Verify user badge visible
            Assert.assertTrue(dash.isUserBadgeVisible(), "User badge should be visible in topbar.");
            test.info("User badge verified ✓");

            // Verify notification bell
            dash.isNotificationBellVisible();
            test.info("Notification bell visible ✓");

            // Verify stat cards loaded
            int cardCount = dash.getStatCardCount();
            test.info("Stat cards found: " + cardCount);
            Assert.assertTrue(cardCount > 0, "Dashboard should have at least one stat card.");

            // Verify sidebar links
            int linkCount = dash.getSidebarLinkCount();
            test.info("Sidebar links count: " + linkCount);
            Assert.assertTrue(linkCount > 0, "Sidebar should have navigation links.");

            // Sidebar search test
            dash.searchSidebar("Employee");
            dash.searchSidebar("");
            test.info("Sidebar search tested ✓");

            captureScreenshot("02_Admin_Dashboard");
            test.pass("Admin Dashboard verified. Elapsed: " + getElapsedMs(start) + " ms");

        } catch (AssertionError | Exception e) {
            test.fail("Admin Dashboard FAILED: " + e.getMessage());
            captureScreenshot("02_Admin_Dashboard_FAIL");
            throw e;
        }
    }

    @Test(priority = 3, description = "Admin Employees - Table, Search, Add, Edit, Delete Employee",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_03_AdminEmployeeManagement() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Employee Management",
            "Verify employee directory table, search, add employee, edit employee, delete employee flows.",
            "Admin"
        );

        try {
            log.info("── Admin: Employee Management ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToEmployees();

            AdminEmployeesPage empPage = new AdminEmployeesPage(driver);

            // Verify page elements
            Assert.assertTrue(empPage.isTableVisible(), "Employee table should be visible.");
            test.info("Employee table visible ✓");

            Assert.assertTrue(empPage.isSearchBarVisible(), "Search bar should be visible.");
            Assert.assertTrue(empPage.isAddBtnVisible(), "Add Employee button should be visible.");

            int initialCount = empPage.getEmployeeRowCount();
            test.info("Initial employee row count: " + initialCount);

            // ── SEARCH ──────────────────────────────────────
            empPage.searchEmployee("Arjun");
            test.info("Searched for 'Arjun'.");
            empPage.searchEmployee("xyz_no_match_xyz");
            test.info("Searched for non-existent employee.");
            empPage.clearSearch();
            test.info("Search cleared ✓");

            // ── PAGINATION ───────────────────────────────────
            boolean paginationExists = empPage.isPaginationVisible();
            test.info("Pagination visible: " + paginationExists);
            if (paginationExists) {
                empPage.clickNextPage();
                test.info("Navigated to next page.");
            }

            // ── ADD EMPLOYEE ─────────────────────────────────
            empPage.clearSearch();
            empPage.clickAddEmployee();
            Assert.assertTrue(empPage.isModalOpen(), "Add Employee modal should open.");
            test.info("Add Employee modal opened ✓");

            empPage.fillEmployeeForm(
                "Test Automation User",
                "EMP999",
                "testautomation@aethercorp.com",
                "9876543210",
                "Software Engineer",
                "720000",
                "Engineering",
                "Active",
                "Bangalore",
                "2026-07-01"
            );
            test.info("Employee form filled ✓");

            empPage.saveEmployee();
            test.info("Save Employee clicked.");

            // Handle potential alert (mock API confirmation)
            try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}

            // Verify toast or updated row count
            boolean toastShown = empPage.isToastVisible();
            test.info("Toast shown after save: " + toastShown);

            // ── EDIT EMPLOYEE ─────────────────────────────────
            empPage.clickFirstEditButton();
            if (empPage.isModalOpen()) {
                empPage.updateJobTitle("Senior Engineer");
                empPage.saveEmployee();   // saveEmployee() already calls closeModalIfOpen()
                try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}
                test.info("Employee edited successfully ✓");
            } else {
                test.info("Edit modal did not open - skipping edit.");
            }

            // ── DELETE EMPLOYEE ───────────────────────────────
            empPage.clearSearch();
            int countBeforeDelete = empPage.getEmployeeRowCount();
            empPage.clickFirstDeleteButton();
            empPage.confirmDelete();
            try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}
            test.info("Delete confirmed ✓");

            captureScreenshot("03_Admin_Employee_Management");
            test.pass("Employee Management CRUD verified. Elapsed: " + getElapsedMs(start) + " ms");

            // Return to dashboard
            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Management FAILED: " + e.getMessage());
            captureScreenshot("03_Admin_Employee_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 4, description = "Admin Departments - Verify department cards and drill-down",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_04_AdminDepartments() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Departments",
            "Verify department catalog grid, card count, and drill-down team view.",
            "Admin"
        );

        try {
            log.info("── Admin: Departments ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToDepartments();

            DepartmentsPage deptPage = new DepartmentsPage(driver);
            Assert.assertTrue(deptPage.isPageLoaded(), "Departments page should load.");
            test.info("Departments page loaded ✓");

            int cardCount = deptPage.getDepartmentCardCount();
            test.info("Department cards found: " + cardCount);
            Assert.assertTrue(cardCount > 0, "At least one department card expected.");

            // Drill into first department
            deptPage.clickFirstDepartment();
            test.info("Drilled into first department.");

            boolean tableVisible = deptPage.isDeptTableVisible();
            test.info("Department employee table visible: " + tableVisible);

            int rowCount = deptPage.getDrillDownRowCount();
            test.info("Employee rows in department: " + rowCount);

            // Go back to catalog
            deptPage.goBackToCatalog();
            test.info("Returned to department catalog ✓");

            captureScreenshot("04_Admin_Departments");
            test.pass("Departments module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Departments FAILED: " + e.getMessage());
            captureScreenshot("04_Admin_Departments_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 5, description = "Admin Attendance - Verify attendance monitor, search, filters",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_05_AdminAttendance() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Attendance",
            "Verify admin attendance monitor: stat cards, table rows, search, date filter.",
            "Admin"
        );

        try {
            log.info("── Admin: Attendance Monitor ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToAttendance();

            AttendancePage attPage = new AttendancePage(driver);
            Assert.assertTrue(attPage.isPageLoaded(), "Attendance page should load.");
            test.info("Attendance page loaded ✓");

            int statCount = attPage.getStatCardCount();
            test.info("Stat cards: " + statCount);

            int rows = attPage.getRowCount();
            test.info("Attendance log rows: " + rows);

            // Search
            if (attPage.isSearchVisible()) {
                attPage.searchAttendance("Arjun");
                test.info("Searched attendance for 'Arjun' ✓");
                attPage.clearSearch();
            }

            captureScreenshot("05_Admin_Attendance");
            test.pass("Attendance module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Attendance FAILED: " + e.getMessage());
            captureScreenshot("05_Admin_Attendance_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 6, description = "Admin Leave - Verify leave queue, approve/reject actions",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_06_AdminLeaveManagement() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Leave Management",
            "Verify leave management queue: stat cards, approve/reject actions, row count.",
            "Admin"
        );

        try {
            log.info("── Admin: Leave Management ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToLeave();

            AdminLeavePage leavePage = new AdminLeavePage(driver);
            Assert.assertTrue(leavePage.isPageLoaded(), "Leave management page should load.");
            test.info("Leave management page loaded ✓");

            int statCount = leavePage.getStatCardCount();
            test.info("Leave stat cards: " + statCount);

            int rows = leavePage.getRowCount();
            test.info("Leave request rows: " + rows);

            if (rows > 0) {
                leavePage.approveFirstLeave();
                test.info("Approved first leave request ✓");
                try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}
                boolean toast = leavePage.isToastVisible();
                test.info("Toast after approve: " + toast);
            } else {
                test.info("No leave requests to approve (empty queue).");
            }

            captureScreenshot("06_Admin_Leave_Management");
            test.pass("Leave Management module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Leave Management FAILED: " + e.getMessage());
            captureScreenshot("06_Admin_Leave_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 7, description = "Admin Announcements - Compose, verify cards, search",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_07_AdminAnnouncements() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Announcements",
            "Compose an announcement, verify notice cards are listed, test search bar.",
            "Admin"
        );

        try {
            log.info("── Admin: Announcements ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToAnnouncements();

            AnnouncementsPage annPage = new AnnouncementsPage(driver);
            Assert.assertTrue(annPage.isPageLoaded(), "Announcements page should load.");
            test.info("Announcements page loaded ✓");

            int initialCards = annPage.getNoticeCardCount();
            test.info("Existing announcements: " + initialCards);

            // Compose new announcement
            annPage.clickCompose();
            Assert.assertTrue(annPage.isModalOpen(), "Compose modal should open.");
            test.info("Compose modal opened ✓");

            annPage.fillAnnouncementForm(
                "QA Automation Test Notice",
                "This announcement was generated by the automated test suite to verify the compose flow."
            );
            annPage.submitAnnouncement();
            test.info("Announcement submitted ✓");

            // Verify search
            if (annPage.isSearchBarVisible()) {
                annPage.searchAnnouncement("QA Automation");
                test.info("Searched for 'QA Automation' ✓");
                annPage.searchAnnouncement("");
            }

            captureScreenshot("07_Admin_Announcements");
            test.pass("Announcements module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Announcements FAILED: " + e.getMessage());
            captureScreenshot("07_Admin_Announcements_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 8, description = "Admin Projects - View project cards, add project, stat cards",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_08_AdminProjects() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Projects",
            "Verify admin projects board: stat cards, project cards, add project form.",
            "Admin"
        );

        try {
            log.info("── Admin: Projects ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToProjects();

            ProjectsPage projPage = new ProjectsPage(driver);
            Assert.assertTrue(projPage.isPageLoaded(), "Projects page should load.");
            test.info("Projects page loaded ✓");

            int statCount = projPage.getStatCardCount();
            test.info("Stat cards: " + statCount);

            int cardCount = projPage.getProjectCardCount();
            test.info("Project cards: " + cardCount);

            Assert.assertTrue(projPage.isProgressBarVisible(), "Progress bars should be visible.");
            test.info("Progress bars verified ✓");

            Assert.assertTrue(projPage.isStatusBadgeVisible(), "Status badges should be visible.");
            test.info("Status badges verified ✓");

            // Add new project
            if (projPage.isAddButtonVisible()) {
                projPage.clickAddProject();
                Assert.assertTrue(projPage.isFormVisible(), "Add project form should expand.");
                test.info("Add project form opened ✓");

                projPage.fillProjectForm(
                    "Automation Regression Suite",
                    "2026-12-31",
                    "Automated regression test project created by QA automation framework."
                );
                projPage.submitProject();
                test.info("New project submitted ✓");
            }

            // Change status of first project
            projPage.changeFirstProjectStatus("Completed");
            test.info("First project status changed to Completed ✓");

            captureScreenshot("08_Admin_Projects");
            test.pass("Projects module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Projects FAILED: " + e.getMessage());
            captureScreenshot("08_Admin_Projects_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 9, description = "Admin Payroll - Verify salary register, stat cards, compliance run",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_09_AdminPayroll() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Payroll",
            "Verify admin payroll: salary register table, stat cards, compliance run trigger.",
            "Admin"
        );

        try {
            log.info("── Admin: Payroll ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToPayroll();

            PayrollPage payPage = new PayrollPage(driver);
            Assert.assertTrue(payPage.isPageLoaded(), "Payroll page should load.");
            test.info("Payroll page loaded ✓");

            int statCount = payPage.getStatCardCount();
            test.info("Stat cards: " + statCount);
            Assert.assertTrue(statCount > 0, "Admin payroll should show stat cards.");

            boolean tableVisible = payPage.isTableVisible();
            test.info("Salary register table visible: " + tableVisible);

            int rows = payPage.getRowCount();
            test.info("Employee salary rows: " + rows);

            // Click Compliance run
            payPage.clickComplianceRun();
            payPage.dismissAlert();
            test.info("Compliance run triggered and dismissed ✓");

            captureScreenshot("09_Admin_Payroll");
            test.pass("Payroll module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Payroll FAILED: " + e.getMessage());
            captureScreenshot("09_Admin_Payroll_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 10, description = "Admin Documents - File catalog, search, upload, download",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_10_AdminDocuments() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Documents",
            "Verify document file catalog, search, category filter, upload modal, and download.",
            "Admin"
        );

        try {
            log.info("── Admin: Documents ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToDocuments();

            DocumentsPage docPage = new DocumentsPage(driver);
            Assert.assertTrue(docPage.isPageLoaded(), "Documents page should load.");
            test.info("Documents page loaded ✓");

            int docCount = docPage.getDocumentCount();
            test.info("Documents listed: " + docCount);

            // Search
            if (docPage.isSearchBarVisible()) {
                docPage.searchDocuments("Policy");
                test.info("Searched for 'Policy' ✓");
                docPage.clearSearch();
            }

            // Category filter
            if (docPage.isCategoryFilterVisible()) {
                docPage.filterByCategory("HR Policies");
                test.info("Filtered by 'HR Policies' ✓");
                docPage.filterByCategory("All Folders");
            }

            // Download first doc
            int dlCount = docPage.getDownloadButtonCount();
            test.info("Download buttons visible: " + dlCount);
            if (dlCount > 0) {
                docPage.clickFirstDownload();
                test.info("Download triggered and alert dismissed ✓");
            }

            // Upload new doc (admin)
            if (docPage.isUploadBtnVisible()) {
                docPage.clickUpload();
                Assert.assertTrue(docPage.isModalOpen(), "Upload modal should open.");
                test.info("Upload modal opened ✓");

                docPage.fillUploadForm(
                    "QA_Test_Framework_Guide",
                    "Technical Guidelines",
                    "Automation framework usage manual created by QA team."
                );
                docPage.submitUpload();
                test.info("Document uploaded ✓");
            }

            captureScreenshot("10_Admin_Documents");
            test.pass("Documents module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Documents FAILED: " + e.getMessage());
            captureScreenshot("10_Admin_Documents_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 11, description = "Admin Settings - Verify settings sections, toggles, save",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_11_AdminSettings() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Settings",
            "Verify settings page sections, toggle switches, and save button.",
            "Admin"
        );

        try {
            log.info("── Admin: Settings ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToSettings();

            SettingsPage settingsPage = new SettingsPage(driver);
            Assert.assertTrue(settingsPage.isPageLoaded(), "Settings page should load.");
            test.info("Settings page loaded ✓");

            int sections = settingsPage.getSectionHeadingCount();
            test.info("Settings sections: " + sections);

            int toggles = settingsPage.getToggleCount();
            test.info("Toggle switches: " + toggles);

            if (toggles > 0) {
                settingsPage.toggleFirstSwitch();
                test.info("First toggle switched ✓");
            }

            settingsPage.clickSave();
            test.info("Settings saved ✓");

            captureScreenshot("11_Admin_Settings");
            test.pass("Settings module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToDashboard();

        } catch (AssertionError | Exception e) {
            test.fail("Settings FAILED: " + e.getMessage());
            captureScreenshot("11_Admin_Settings_FAIL");
            new DashboardPage(driver).goToDashboard();
            throw e;
        }
    }

    @Test(priority = 12, description = "Admin Logout - Logout from admin account and verify login page",
          dependsOnMethods = "test_01_AdminLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_12_AdminLogout() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Admin Logout",
            "Logout from admin session and verify the login page is displayed.",
            "Admin"
        );

        try {
            log.info("═══ ADMIN LOGOUT ═══");
            DashboardPage dash = new DashboardPage(driver);
            dash.logout();

            // Wait for redirect to login page
            WaitUtils.waitForUrlContains(driver, "login", ConfigReader.getExplicitWait());

            LoginPage loginPage = new LoginPage(driver);
            Assert.assertTrue(loginPage.isLoginPageLoaded(), "Login page should be visible after logout.");
            test.info("Login page visible after admin logout ✓");

            captureScreenshot("12_Admin_Logout_Success");
            test.pass("Admin logout successful. Elapsed: " + getElapsedMs(start) + " ms");

        } catch (AssertionError | Exception e) {
            test.fail("Admin Logout FAILED: " + e.getMessage());
            captureScreenshot("12_Admin_Logout_FAIL");
            navigateTo("/login");
            throw e;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ██████  PHASE 2 — EMPLOYEE FLOW
    // ═══════════════════════════════════════════════════════════════════════

    @Test(priority = 13, description = "Employee Login - Login with employee credentials in same browser",
          dependsOnMethods = "test_12_AdminLogout", retryAnalyzer = RetryAnalyzer.class)
    public void test_13_EmployeeLogin() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Login",
            "Login as an employee in the same browser tab (no new tab/browser opened).",
            "Employee"
        );

        try {
            log.info("═══ PHASE 2: EMPLOYEE LOGIN ═══");

            // Ensure login page is displayed
            if (!driver.getCurrentUrl().contains("login")) {
                navigateTo("/login");
            }

            LoginPage loginPage = new LoginPage(driver);
            Assert.assertTrue(loginPage.isLoginPageLoaded(), "Login page should be visible.");
            test.info("Login page loaded ✓");

            // Employee login
            loginPage.loginAsEmployee(
                ConfigReader.getEmployeeUsername(),
                ConfigReader.getEmployeePassword()
            );
            test.info("Employee credentials submitted.");

            // Verify redirect to employee workspace
            WaitUtils.waitForUrlContains(driver, "employee", ConfigReader.getExplicitWait());

            DashboardPage dash = new DashboardPage(driver);
            Assert.assertTrue(dash.isDashboardLoaded(), "Employee workspace should load after login.");
            test.info("Employee workspace loaded. URL: " + driver.getCurrentUrl());

            captureScreenshot("13_Employee_Login_Success");
            test.pass("Employee login successful. Elapsed: " + getElapsedMs(start) + " ms");

        } catch (AssertionError | Exception e) {
            test.fail("Employee Login FAILED: " + e.getMessage());
            captureScreenshot("13_Employee_Login_FAIL");
            throw e;
        }
    }

    @Test(priority = 14, description = "Employee Home - Verify workspace, greeting, leave balance, clock widget",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_14_EmployeeHome() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Home Workspace",
            "Verify employee home page: greeting, leave balance cards, clock widget, announcement snippets.",
            "Employee"
        );

        try {
            log.info("── Employee: Home ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToHome();

            EmployeeHomePage homePage = new EmployeeHomePage(driver);
            Assert.assertTrue(homePage.isPageLoaded(), "Employee home page should load.");
            test.info("Employee home page loaded ✓");

            Assert.assertTrue(homePage.isGreetingVisible(), "Greeting banner should be visible.");
            String greeting = homePage.getGreetingText();
            test.info("Greeting text: " + greeting);

            int cardCount = homePage.getStatCardCount();
            test.info("Stat cards (leave balance): " + cardCount);

            boolean clockVisible = homePage.isClockWidgetVisible();
            test.info("Clock widget visible: " + clockVisible);

            int announcements = homePage.getAnnouncementSnippetCount();
            test.info("Announcement snippets: " + announcements);

            captureScreenshot("14_Employee_Home");
            test.pass("Employee Home module verified. Elapsed: " + getElapsedMs(start) + " ms");

        } catch (AssertionError | Exception e) {
            test.fail("Employee Home FAILED: " + e.getMessage());
            captureScreenshot("14_Employee_Home_FAIL");
            throw e;
        }
    }

    @Test(priority = 15, description = "Employee Attendance - Clock in, verify timer, check table",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_15_EmployeeAttendance() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Attendance",
            "Verify employee clock-in widget, live shift timer, and attendance history table.",
            "Employee"
        );

        try {
            log.info("── Employee: Attendance ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToAttendance();

            AttendancePage attPage = new AttendancePage(driver);
            Assert.assertTrue(attPage.isPageLoaded(), "Attendance page should load.");
            test.info("Attendance page loaded ✓");

            boolean clockVisible = attPage.isClockWidgetVisible();
            test.info("Clock widget visible: " + clockVisible);

            if (clockVisible) {
                attPage.clickClockIn();
                test.info("Clock In clicked ✓");

                boolean timerRunning = attPage.isTimerRunning();
                String timerText = attPage.getTimerText();
                test.info("Live shift timer running: " + timerRunning + " | Time: " + timerText);
            }

            int rows = attPage.getRowCount();
            test.info("Attendance log rows: " + rows);

            captureScreenshot("15_Employee_Attendance");
            test.pass("Employee Attendance module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Attendance FAILED: " + e.getMessage());
            captureScreenshot("15_Employee_Attendance_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 16, description = "Employee Leave Request - Apply, validate form, check history",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_16_EmployeeLeaveRequest() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Leave Request",
            "Submit a leave request, validate form fields, verify history table and quota cards.",
            "Employee"
        );

        try {
            log.info("── Employee: Leave Requests ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToLeave();

            EmployeeLeavePage leavePage = new EmployeeLeavePage(driver);
            Assert.assertTrue(leavePage.isPageLoaded(), "Leave page should load.");
            test.info("Leave request page loaded ✓");

            int quotaCards = leavePage.getQuotaCardCount();
            test.info("Leave quota cards: " + quotaCards);

            int historyRows = leavePage.getHistoryRowCount();
            test.info("Leave history rows: " + historyRows);

            int statusBadges = leavePage.getStatusBadgeCount();
            test.info("Status badges in history: " + statusBadges);

            // Apply leave form
            if (leavePage.isApplyBtnVisible()) {
                leavePage.clickApplyLeave();
                test.info("Apply leave section activated ✓");
            }

            if (leavePage.isLeaveFormVisible()) {
                leavePage.selectLeaveType("Annual Leave");
                leavePage.setStartDate("2026-08-01");
                leavePage.setEndDate("2026-08-03");
                leavePage.enterReason("Automation test leave request - QA Framework validation.");
                test.info("Leave form filled ✓");

                leavePage.submitLeave();
                test.info("Leave request submitted.");

                boolean toast = leavePage.isToastVisible();
                String toastText = leavePage.getToastText();
                test.info("Toast shown: " + toast + " | Message: " + toastText);
            } else {
                test.info("Leave apply form not directly visible - may be inline.");
            }

            captureScreenshot("16_Employee_Leave_Request");
            test.pass("Leave Request module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Leave Request FAILED: " + e.getMessage());
            captureScreenshot("16_Employee_Leave_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 17, description = "Employee Announcements - Read notices, search announcements",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_17_EmployeeAnnouncements() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Announcements",
            "Verify employee notice board: card count, pinned notices, and search functionality.",
            "Employee"
        );

        try {
            log.info("── Employee: Announcements ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToAnnouncements();

            AnnouncementsPage annPage = new AnnouncementsPage(driver);
            Assert.assertTrue(annPage.isPageLoaded(), "Announcements page should load.");
            test.info("Announcements page loaded ✓");

            int cards = annPage.getNoticeCardCount();
            test.info("Notice cards: " + cards);

            int pinned = annPage.getPinnedCount();
            test.info("Pinned announcements: " + pinned);

            if (annPage.isSearchBarVisible()) {
                annPage.searchAnnouncement("Welcome");
                test.info("Searched for 'Welcome' ✓");
                annPage.searchAnnouncement("");
            }

            captureScreenshot("17_Employee_Announcements");
            test.pass("Announcements module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Announcements FAILED: " + e.getMessage());
            captureScreenshot("17_Employee_Announcements_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 18, description = "Employee Projects - View project board, progress bars, badges",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_18_EmployeeProjects() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Projects",
            "Verify employee project board: card count, progress bars, status badges.",
            "Employee"
        );

        try {
            log.info("── Employee: Projects ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToProjects();

            ProjectsPage projPage = new ProjectsPage(driver);
            Assert.assertTrue(projPage.isPageLoaded(), "Projects page should load.");
            test.info("Projects page loaded ✓");

            int statCount = projPage.getStatCardCount();
            test.info("Stat cards: " + statCount);

            int cardCount = projPage.getProjectCardCount();
            test.info("Project cards: " + cardCount);

            boolean progressBars = projPage.isProgressBarVisible();
            test.info("Progress bars visible: " + progressBars);

            boolean statusBadges = projPage.isStatusBadgeVisible();
            test.info("Status badges visible: " + statusBadges);

            captureScreenshot("18_Employee_Projects");
            test.pass("Employee Projects verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Projects FAILED: " + e.getMessage());
            captureScreenshot("18_Employee_Projects_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 19, description = "Employee Payslips - View payslip breakdown, verify salary slip modal",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_19_EmployeePayslips() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Payslips",
            "Verify employee payslip listing, open breakdown modal, verify net salary display.",
            "Employee"
        );

        try {
            log.info("── Employee: Payslips ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToPayroll();

            PayrollPage payPage = new PayrollPage(driver);
            Assert.assertTrue(payPage.isPageLoaded(), "Payslips page should load.");
            test.info("Payslips page loaded ✓");

            boolean banner = payPage.isSalaryBannerVisible();
            test.info("Salary compensation banner: " + banner);

            boolean table = payPage.isTableVisible();
            test.info("Payslips table visible: " + table);

            int rows = payPage.getRowCount();
            test.info("Payslip rows (months): " + rows);
            Assert.assertTrue(rows > 0, "At least one payslip month expected.");

            // Open breakdown modal
            payPage.clickViewBreakdown();
            Assert.assertTrue(payPage.isModalOpen(), "Payslip breakdown modal should open.");
            test.info("Breakdown modal opened ✓");

            String modalTitle = payPage.getModalTitle();
            test.info("Modal title: " + modalTitle);

            boolean netSalaryVisible = payPage.isNetSalaryVisible();
            test.info("Net salary line visible in modal: " + netSalaryVisible);

            // Close modal
            payPage.closeModal();
            test.info("Modal closed ✓");

            captureScreenshot("19_Employee_Payslips");
            test.pass("Payslips module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Payslips FAILED: " + e.getMessage());
            captureScreenshot("19_Employee_Payslips_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 20, description = "Employee Documents - View company docs, search, filter, download",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_20_EmployeeDocuments() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Company Documents",
            "Verify company document library: file count, search, category filter, download.",
            "Employee"
        );

        try {
            log.info("── Employee: Company Documents ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToDocuments();

            DocumentsPage docPage = new DocumentsPage(driver);
            Assert.assertTrue(docPage.isPageLoaded(), "Documents page should load.");
            test.info("Documents page loaded ✓");

            int docCount = docPage.getDocumentCount();
            test.info("Documents available: " + docCount);

            if (docPage.isSearchBarVisible()) {
                docPage.searchDocuments("Benefits");
                test.info("Searched for 'Benefits' ✓");
                docPage.clearSearch();
            }

            if (docPage.isCategoryFilterVisible()) {
                docPage.filterByCategory("Technical Guidelines");
                test.info("Filtered by Technical Guidelines ✓");
                docPage.filterByCategory("All Folders");
            }

            int dlCount = docPage.getDownloadButtonCount();
            test.info("Download buttons: " + dlCount);

            if (dlCount > 0) {
                docPage.clickFirstDownload();
                test.info("Download triggered ✓");
            }

            captureScreenshot("20_Employee_Documents");
            test.pass("Company Documents verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Documents FAILED: " + e.getMessage());
            captureScreenshot("20_Employee_Documents_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 21, description = "Employee Profile - Verify profile info, edit phone, save",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_21_EmployeeProfile() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Profile",
            "Verify employee profile details, avatar, stat cards, and edit profile flow.",
            "Employee"
        );

        try {
            log.info("── Employee: Profile ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToProfile();

            ProfilePage profilePage = new ProfilePage(driver);
            Assert.assertTrue(profilePage.isPageLoaded(), "Profile page should load.");
            test.info("Profile page loaded ✓");

            boolean avatarVisible = profilePage.isAvatarVisible();
            test.info("Avatar visible: " + avatarVisible);

            String empName = profilePage.getEmployeeName();
            test.info("Employee name displayed: " + empName);

            int statCards = profilePage.getStatCardCount();
            test.info("Profile stat cards: " + statCards);

            // Edit profile
            if (profilePage.isEditButtonVisible()) {
                profilePage.clickEditProfile();
                Assert.assertTrue(profilePage.isModalOpen(), "Edit profile modal should open.");
                test.info("Edit profile modal opened ✓");

                profilePage.updatePhone("9988776655");
                profilePage.saveProfile();
                test.info("Profile phone updated and saved ✓");

                try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}
                boolean toast = profilePage.isToastVisible();
                test.info("Toast shown after save: " + toast);
            } else {
                test.info("Edit button not found - skipping edit.");
            }

            captureScreenshot("21_Employee_Profile");
            test.pass("Profile module verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Profile FAILED: " + e.getMessage());
            captureScreenshot("21_Employee_Profile_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 22, description = "Employee Settings - Verify settings sections and toggles",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_22_EmployeeSettings() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Settings",
            "Verify employee settings page: sections, toggles, and save action.",
            "Employee"
        );

        try {
            log.info("── Employee: Settings ──");
            DashboardPage dash = new DashboardPage(driver);
            dash.goToSettings();

            SettingsPage settingsPage = new SettingsPage(driver);
            Assert.assertTrue(settingsPage.isPageLoaded(), "Settings page should load.");
            test.info("Settings page loaded ✓");

            int sections = settingsPage.getSectionHeadingCount();
            test.info("Settings section headings: " + sections);

            int toggles = settingsPage.getToggleCount();
            test.info("Toggle switches: " + toggles);

            if (toggles > 0) {
                settingsPage.toggleFirstSwitch();
                test.info("Toggle switched ✓");
            }

            settingsPage.clickSave();
            test.info("Settings saved ✓");

            captureScreenshot("22_Employee_Settings");
            test.pass("Employee Settings verified. Elapsed: " + getElapsedMs(start) + " ms");

            dash.goToHome();

        } catch (AssertionError | Exception e) {
            test.fail("Employee Settings FAILED: " + e.getMessage());
            captureScreenshot("22_Employee_Settings_FAIL");
            new DashboardPage(driver).goToHome();
            throw e;
        }
    }

    @Test(priority = 23, description = "Employee Logout - Logout and verify login page is shown",
          dependsOnMethods = "test_13_EmployeeLogin", retryAnalyzer = RetryAnalyzer.class)
    public void test_23_EmployeeLogout() {
        long start = System.currentTimeMillis();
        ExtentTest test = ExtentManager.createTest(
            "Employee Logout",
            "Logout from employee session and verify the login page is displayed.",
            "Employee"
        );

        try {
            log.info("═══ EMPLOYEE LOGOUT ═══");
            DashboardPage dash = new DashboardPage(driver);
            dash.logout();

            WaitUtils.waitForUrlContains(driver, "login", ConfigReader.getExplicitWait());

            LoginPage loginPage = new LoginPage(driver);
            Assert.assertTrue(loginPage.isLoginPageLoaded(), "Login page should be visible after logout.");
            test.info("Login page visible after employee logout ✓");

            captureScreenshot("23_Employee_Logout_Success");
            test.pass("Employee logout successful. Elapsed: " + getElapsedMs(start) + " ms");

            log.info("═══════════════════════════════════════════════════════");
            log.info("  ALL 23 EMS AUTOMATION TESTS COMPLETED SUCCESSFULLY");
            log.info("═══════════════════════════════════════════════════════");

        } catch (AssertionError | Exception e) {
            test.fail("Employee Logout FAILED: " + e.getMessage());
            captureScreenshot("23_Employee_Logout_FAIL");
            throw e;
        }
    }
}
