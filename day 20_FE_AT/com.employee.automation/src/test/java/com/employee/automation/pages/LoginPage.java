package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

/**
 * LoginPage - Page Object for the EMS Login screen.
 * Supports Admin and Employee login flows using CSS locators matching the React app.
 */
public class LoginPage {

    private static final Logger log = LogManager.getLogger(LoginPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators (matching the EMS React Login page) ──────────────────────

    // Admin/Employee role toggle buttons (the two pill buttons on the login form)
    private final By adminTab     = By.cssSelector("button[id*='admin'], button[data-role='admin']");
    private final By employeeTab  = By.cssSelector("button[id*='employee'], button[data-role='employee']");

    // Generic: first visible toggle button group
    private final By roleToggleFirst  = By.cssSelector(".login-tabs button:first-child, .tab-btn:first-child");
    private final By roleToggleSecond = By.cssSelector(".login-tabs button:last-child, .tab-btn:last-child");

    // Input fields
    private final By usernameField = By.cssSelector("input[type='text'], input[placeholder*='ID'], input[placeholder*='id'], input[placeholder*='username'], input[name='username']");
    private final By passwordField = By.cssSelector("input[type='password']");

    // Eye toggle for password visibility
    private final By eyeToggle = By.cssSelector("button[aria-label*='password'], .eye-btn, button svg.lucide-eye, button svg.lucide-eye-off");

    // Submit button
    private final By submitBtn = By.cssSelector("button[type='submit'], form button.btn-primary");

    // Error message
    private final By errorMsg = By.cssSelector(".error-message, .alert-error, [class*='error']");

    // ── Constructor ────────────────────────────────────────────────────────

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    // ── Actions ───────────────────────────────────────────────────────────

    /**
     * Verify the login page is loaded by checking password field visibility.
     */
    public boolean isLoginPageLoaded() {
        boolean loaded = WaitUtils.isVisible(driver, passwordField, WAIT);
        log.info("Login page loaded: " + loaded);
        return loaded;
    }

    /**
     * Select Admin role tab on the login form.
     */
    public void selectAdminRole() {
        log.info("Selecting Admin role on login form...");
        try {
            WebElement tab = WaitUtils.waitForClickable(driver, adminTab, WAIT);
            tab.click();
        } catch (Exception e) {
            log.warn("Could not click adminTab, trying fallback: " + e.getMessage());
            try {
                WebElement tab2 = WaitUtils.waitForClickable(driver, roleToggleSecond, WAIT);
                tab2.click();
            } catch (Exception ex) {
                log.warn("Could not click role toggle, proceeding anyway: " + ex.getMessage());
            }
        }
    }

    /**
     * Select Employee role tab on the login form.
     */
    public void selectEmployeeRole() {
        log.info("Selecting Employee role on login form...");
        try {
            WebElement tab = WaitUtils.waitForClickable(driver, employeeTab, WAIT);
            tab.click();
        } catch (Exception e) {
            log.warn("Could not click employeeTab, trying fallback: " + e.getMessage());
            try {
                WebElement tab2 = WaitUtils.waitForClickable(driver, roleToggleFirst, WAIT);
                tab2.click();
            } catch (Exception ex) {
                log.warn("Could not click role toggle, proceeding anyway: " + ex.getMessage());
            }
        }
    }

    /**
     * Enter username into the credential field.
     */
    public void enterUsername(String username) {
        WebElement field = WaitUtils.waitForVisible(driver, usernameField, WAIT);
        field.clear();
        field.sendKeys(username);
        log.info("Entered username: " + username);
    }

    /**
     * Enter password into the password field.
     */
    public void enterPassword(String password) {
        WebElement field = WaitUtils.waitForVisible(driver, passwordField, WAIT);
        field.clear();
        field.sendKeys(password);
        log.info("Entered password: [HIDDEN]");
    }

    /**
     * Click the submit / Sign In button.
     */
    public void clickSignIn() {
        WaitUtils.waitForClickable(driver, submitBtn, WAIT).click();
        log.info("Clicked Sign In button.");
    }

    /**
     * Full admin login flow.
     */
    public void loginAsAdmin(String username, String password) {
        log.info("Logging in as ADMIN: " + username);
        isLoginPageLoaded();
        selectAdminRole();
        enterUsername(username);
        enterPassword(password);
        clickSignIn();
    }

    /**
     * Full employee login flow.
     */
    public void loginAsEmployee(String username, String password) {
        log.info("Logging in as EMPLOYEE: " + username);
        isLoginPageLoaded();
        selectEmployeeRole();
        enterUsername(username);
        enterPassword(password);
        clickSignIn();
    }

    /**
     * Check if an error message is displayed after login attempt.
     */
    public boolean isErrorDisplayed() {
        return WaitUtils.isVisible(driver, errorMsg, 5);
    }

    /**
     * Get error message text.
     */
    public String getErrorMessage() {
        try {
            return WaitUtils.waitForVisible(driver, errorMsg, 5).getText();
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Toggle the password visibility eye icon.
     */
    public void togglePasswordVisibility() {
        try {
            WaitUtils.waitForClickable(driver, eyeToggle, 5).click();
            log.info("Password visibility toggled.");
        } catch (Exception e) {
            log.warn("Eye toggle not found or not clickable.");
        }
    }

    /**
     * Verify the submit button is present and enabled.
     */
    public boolean isSubmitButtonEnabled() {
        try {
            WebElement btn = WaitUtils.waitForVisible(driver, submitBtn, WAIT);
            return btn.isEnabled();
        } catch (Exception e) {
            return false;
        }
    }
}
