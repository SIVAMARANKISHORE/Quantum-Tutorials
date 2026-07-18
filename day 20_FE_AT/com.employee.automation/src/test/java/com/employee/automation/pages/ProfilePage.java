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
 * ProfilePage - Page Object for the Employee Profile module.
 * Covers: profile data verification, edit form, bio update, avatar.
 */
public class ProfilePage {

    private static final Logger log = LogManager.getLogger(ProfilePage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading      = By.cssSelector("h2, h3");
    private final By profileCard      = By.cssSelector(".card, .profile-card");
    private final By avatarElement    = By.cssSelector(".avatar, .profile-avatar, [class*='avatar']");
    private final By employeeName     = By.cssSelector(".profile-name, h3, h2");
    private final By employeeId       = By.cssSelector("[class*='emp-id'], [class*='id']");
    private final By jobTitle         = By.cssSelector("[class*='job'], [class*='title']");
    // Scoped to profile card — avoids matching topbar buttons
    private final By editProfileBtn   = By.cssSelector(".profile-card button.btn-primary, .card button.btn-primary, .main-content button.btn-primary, button[class*='primary']");
    private final By modalOverlay     = By.cssSelector(".modal-overlay");
    private final By inputName        = By.cssSelector("input[name='name'], input[placeholder*='Name']");
    private final By inputEmail       = By.cssSelector("input[type='email'], input[name='email']");
    private final By inputPhone       = By.cssSelector("input[type='tel'], input[name='phone']");
    private final By inputJobTitle    = By.cssSelector("input[name='jobTitle'], input[placeholder*='Title']");
    private final By saveBtn          = By.cssSelector("button[type='submit'], .modal-footer button.btn-primary");
    private final By cancelBtn        = By.cssSelector(".modal-footer button.btn-secondary");
    private final By infoItems        = By.cssSelector(".profile-info li, .info-row, [class*='info-item']");
    private final By toastMsg         = By.cssSelector(".toast, [class*='toast']");
    private final By statCards        = By.cssSelector(".stat-card, .card.stat-card");

    public ProfilePage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded()    { return WaitUtils.isVisible(driver, profileCard, WAIT); }
    public boolean isAvatarVisible() { return WaitUtils.isVisible(driver, avatarElement, 5); }

    public String getEmployeeName() {
        try { return WaitUtils.waitForVisible(driver, employeeName, WAIT).getText(); } catch (Exception e) { return ""; }
    }

    public int getStatCardCount() {
        try { return driver.findElements(statCards).size(); } catch (Exception e) { return 0; }
    }

    public boolean isEditButtonVisible() { return WaitUtils.isVisible(driver, editProfileBtn, 5); }

    // ── Edit Profile ───────────────────────────────────────────────────────

    public void clickEditProfile() {
        try {
            WebElement btn = WaitUtils.waitForClickable(driver, editProfileBtn, WAIT);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
        } catch (Exception e) {
            // Text-match fallback
            List<WebElement> all = driver.findElements(By.cssSelector("button"));
            for (WebElement b : all) {
                String t = b.getText().toLowerCase();
                if (t.contains("edit") || t.contains("profile") || t.contains("update")) {
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", b);
                    break;
                }
            }
        }
        // Soft-wait: modal may or may not appear depending on component
        WaitUtils.isVisible(driver, modalOverlay, 5);
        log.info("Edit profile button clicked.");
    }

    public boolean isModalOpen() { return WaitUtils.isVisible(driver, modalOverlay, 5); }

    public void updatePhone(String phone) {
        try {
            WebElement phoneEl = WaitUtils.waitForVisible(driver, inputPhone, 5);
            phoneEl.clear(); phoneEl.sendKeys(phone);
            log.info("Phone updated to: " + phone);
        } catch (Exception e) { log.warn("Phone field not found."); }
    }

    public void saveProfile() {
        WaitUtils.waitForClickable(driver, saveBtn, WAIT).click();
        log.info("Profile saved.");
    }

    public void cancelEdit() {
        try { WaitUtils.waitForClickable(driver, cancelBtn, 5).click(); }
        catch (Exception e) { log.warn("Cancel button not found."); }
    }

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }
    public String getToastText() {
        try { return WaitUtils.waitForVisible(driver, toastMsg, 5).getText(); } catch (Exception e) { return ""; }
    }
}
