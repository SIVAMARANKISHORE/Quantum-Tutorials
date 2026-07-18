package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * DashboardPage - Page Object for the main navigation shell (Sidebar + Topbar).
 * Works for both Admin and Employee workspaces.
 */
public class DashboardPage {

    private static final Logger log = LogManager.getLogger(DashboardPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    /** Base URL of the React dev server */
    private static final String BASE_URL = "http://localhost:5173";

    // ── Route constants ─────────────────────────────────────────────────────
    private static final String ROUTE_DASHBOARD     = "/admin/dashboard";
    private static final String ROUTE_EMPLOYEES     = "/admin/employees";
    private static final String ROUTE_DEPARTMENTS   = "/admin/departments";
    private static final String ROUTE_ATTENDANCE    = "/admin/attendance";
    private static final String ROUTE_LEAVE_ADMIN   = "/admin/leave";
    private static final String ROUTE_PAYROLL_ADMIN = "/admin/payroll";
    private static final String ROUTE_DOCUMENTS     = "/admin/documents";
    private static final String ROUTE_ANNOUNCEMENTS = "/admin/announcements";
    private static final String ROUTE_SETTINGS      = "/admin/settings";
    private static final String ROUTE_HOME          = "/employee/home";
    private static final String ROUTE_LEAVE_EMP     = "/employee/leave";
    private static final String ROUTE_PAYROLL_EMP   = "/employee/payroll";
    private static final String ROUTE_PROFILE       = "/employee/profile";
    private static final String ROUTE_SETTINGS_EMP  = "/employee/settings";

    // ── Sidebar Navigation Locators ────────────────────────────────────────
    private final By sidebarLinks     = By.cssSelector(".sidebar nav a, .sidebar a[href], .nav-link");
    private final By sidebarSearchBox = By.cssSelector(".sidebar-search-box input, .sidebar input[placeholder*='Search'], .search-panel input");

    // Topbar elements
    private final By topbarTitle      = By.cssSelector("h1.topbar-title, .topbar-title");
    private final By userBadge        = By.cssSelector(".topbar-avatar-wrap, .user-badge, .topbar-user");
    // Actual DOM: <button class="btn btn-ghost btn-sm" title="Log Out">
    private final By logoutButton     = By.cssSelector("button[title='Log Out'], button[title*='Logout'], .logout-btn");

    // Stat cards (actual class: "card stat-card")
    private final By statCards        = By.cssSelector(".card.stat-card, .stat-card");

    // Notification bell
    private final By notificationBell = By.cssSelector(".bell-btn, button[aria-label*='notification']");

    // ── Sidebar nav link locators ──────────────────────────────────────────
    private final By navDashboard     = By.cssSelector("a[href*='/admin/dashboard'], a[href*='dashboard']");
    private final By navEmployees     = By.cssSelector("a[href*='/admin/employees'], a[href*='employees']");
    private final By navDepartments   = By.cssSelector("a[href*='/admin/departments'], a[href*='departments']");
    private final By navAttendance    = By.cssSelector("a[href*='/admin/attendance'], a[href*='attendance']");
    private final By navLeave         = By.cssSelector("a[href*='/admin/leave'], a[href*='/employee/leave'], a[href*='leave']");
    private final By navProjects      = By.cssSelector("a[href*='projects']");
    private final By navPayroll       = By.cssSelector("a[href*='payroll']");
    private final By navDocuments     = By.cssSelector("a[href*='documents']");
    private final By navAnnouncements = By.cssSelector("a[href*='announcements']");
    private final By navSettings      = By.cssSelector("a[href*='settings']");
    private final By navProfile       = By.cssSelector("a[href*='profile']");
    private final By navHome          = By.cssSelector("a[href*='home']");

    // ── Constructor ────────────────────────────────────────────────────────

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
    }

    // ── Verification Methods ───────────────────────────────────────────────

    public boolean isDashboardLoaded() {
        boolean loaded = WaitUtils.isVisible(driver, sidebarLinks, WAIT);
        log.info("Dashboard/shell loaded: " + loaded);
        return loaded;
    }

    public String getPageTitle() {
        try {
            return WaitUtils.waitForVisible(driver, topbarTitle, WAIT).getText();
        } catch (Exception e) {
            return driver.getTitle();
        }
    }

    public boolean isUserBadgeVisible() {
        return WaitUtils.isVisible(driver, userBadge, WAIT);
    }

    public int getStatCardCount() {
        try {
            List<WebElement> cards = WaitUtils.waitForAllVisible(driver, statCards, WAIT);
            return cards.size();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isNotificationBellVisible() {
        return WaitUtils.isVisible(driver, notificationBell, 5);
    }

    // ── Navigation Methods ─────────────────────────────────────────────────

    public void goToDashboard() {
        navigateTo(navDashboard, "Dashboard", ROUTE_DASHBOARD);
    }

    public void goToEmployees() {
        navigateTo(navEmployees, "Employees", ROUTE_EMPLOYEES);
    }

    public void goToDepartments() {
        navigateTo(navDepartments, "Departments", ROUTE_DEPARTMENTS);
    }

    public void goToAttendance() {
        navigateTo(navAttendance, "Attendance", ROUTE_ATTENDANCE);
    }

    public void goToLeave() {
        String currentUrl = driver.getCurrentUrl();
        String leaveRoute = currentUrl.contains("/employee/") ? ROUTE_LEAVE_EMP : ROUTE_LEAVE_ADMIN;
        navigateTo(navLeave, "Leave", leaveRoute);
    }

    public void goToProjects() {
        String currentUrl = driver.getCurrentUrl();
        String route = currentUrl.contains("/employee/") ? "/employee/projects" : "/admin/projects";
        navigateTo(navProjects, "Projects", route);
    }

    public void goToPayroll() {
        String currentUrl = driver.getCurrentUrl();
        String route = currentUrl.contains("/employee/") ? ROUTE_PAYROLL_EMP : ROUTE_PAYROLL_ADMIN;
        navigateTo(navPayroll, "Payroll", route);
    }

    public void goToDocuments() {
        String currentUrl = driver.getCurrentUrl();
        String route = currentUrl.contains("/employee/") ? "/employee/documents" : ROUTE_DOCUMENTS;
        navigateTo(navDocuments, "Documents", route);
    }

    public void goToAnnouncements() {
        String currentUrl = driver.getCurrentUrl();
        String route = currentUrl.contains("/employee/") ? "/employee/announcements" : ROUTE_ANNOUNCEMENTS;
        navigateTo(navAnnouncements, "Announcements", route);
    }

    public void goToSettings() {
        String currentUrl = driver.getCurrentUrl();
        String route = currentUrl.contains("/employee/") ? ROUTE_SETTINGS_EMP : ROUTE_SETTINGS;
        navigateTo(navSettings, "Settings", route);
    }

    public void goToProfile() {
        navigateTo(navProfile, "Profile", ROUTE_PROFILE);
    }

    public void goToHome() {
        navigateTo(navHome, "Home", ROUTE_HOME);
    }

    public void searchSidebar(String query) {
        try {
            WebElement searchBox = WaitUtils.waitForVisible(driver, sidebarSearchBox, 5);
            searchBox.clear();
            searchBox.sendKeys(query);
            log.info("Searched sidebar: " + query);
        } catch (Exception e) {
            log.warn("Sidebar search box not found.");
        }
    }

    /**
     * Performs logout — scoped to the sidebar user section to avoid hitting wrong button.
     */
    public void logout() {
        log.info("Performing logout...");
        // First try sidebar logout button (scoped)
        try {
            By sidebarLogout = By.cssSelector(
                ".sidebar-user button[title='Log Out'], .sidebar button[title='Log Out']");
            WebElement btn = WaitUtils.waitForClickable(driver, sidebarLogout, 5);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            log.info("Logout clicked via sidebar button.");
            return;
        } catch (Exception e) {
            log.warn("Sidebar logout not found, trying generic selector.");
        }
        // Fallback: any logout-titled button
        try {
            WebElement btn = WaitUtils.waitForClickable(driver, logoutButton, WAIT);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            log.info("Logout clicked via generic selector.");
        } catch (Exception e) {
            log.error("Logout button not found: " + e.getMessage());
        }
    }

    public int getSidebarLinkCount() {
        try {
            return WaitUtils.waitForAllVisible(driver, sidebarLinks, WAIT).size();
        } catch (Exception e) {
            return 0;
        }
    }

    // ── Internal Helpers ───────────────────────────────────────────────────

    /**
     * Dismiss any open modal overlay using Escape key first, then JS removal.
     * Avoids clicking close-btn which could accidentally trigger navigation/logout.
     */
    private void dismissAnyModal() {
        try {
            By modalOverlay = By.cssSelector(".modal-overlay, .modal-backdrop");
            if (WaitUtils.isVisible(driver, modalOverlay, 2)) {
                log.warn("Modal overlay detected — dismissing before navigation.");
                // Press Escape key to close modal
                driver.findElement(By.cssSelector("body"))
                      .sendKeys(org.openqa.selenium.Keys.ESCAPE);
                Thread.sleep(400);
                // If still open, use JS to remove overlay from DOM
                if (WaitUtils.isVisible(driver, modalOverlay, 1)) {
                    ((JavascriptExecutor) driver).executeScript(
                        "document.querySelectorAll('.modal-overlay, .modal-backdrop').forEach(e => e.remove());"
                    );
                    Thread.sleep(200);
                }
                log.info("Modal overlay dismissed.");
            }
        } catch (Exception e) {
            log.warn("Could not dismiss modal: " + e.getMessage());
        }
    }

    /**
     * Navigate to a module. Tries sidebar click first, then falls back to direct URL.
     */
    private void navigateTo(By locator, String moduleName, String route) {
        log.info("Navigating to module: " + moduleName);
        dismissAnyModal();

        // Try sidebar JS-click first (avoids element-not-clickable issues)
        try {
            WebElement link = WaitUtils.waitForClickable(driver, locator, 5);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", link);
            WaitUtils.waitForPageLoad(driver, WAIT);
            log.info("Navigation complete (sidebar): " + moduleName);
            return;
        } catch (Exception e) {
            log.warn("Sidebar click failed for " + moduleName
                + " — falling back to direct URL: " + e.getMessage());
        }

        // Fallback: navigate directly by URL (robust against sidebar state issues)
        if (route != null && !route.isEmpty()) {
            try {
                String targetUrl = BASE_URL + route;
                driver.navigate().to(targetUrl);
                WaitUtils.waitForPageLoad(driver, WAIT);
                WaitUtils.isVisible(driver, sidebarLinks, WAIT);
                log.info("Navigation complete (direct URL): " + moduleName + " → " + targetUrl);
            } catch (Exception ex) {
                log.error("Direct URL navigation failed for " + moduleName + ": " + ex.getMessage());
            }
        }
    }
}
