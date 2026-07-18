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
 * SettingsPage - Page Object for the Settings module (shared Admin + Employee).
 * Covers: toggle switches, preference dropdowns, save actions.
 */
public class SettingsPage {

    private static final Logger log = LogManager.getLogger(SettingsPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading     = By.cssSelector("h2");
    private final By settingCards    = By.cssSelector(".card, .settings-section");
    private final By toggleSwitches  = By.cssSelector("input[type='checkbox'], .toggle-switch input");
    private final By selectDropdowns = By.cssSelector("select");
    // Scoped to main content — not topbar
    private final By saveButtons     = By.cssSelector(".main-content button.btn-primary, main button.btn-primary, .settings button.btn-primary, button[type='submit']");
    private final By sectionHeadings = By.cssSelector(".settings-section h3, .card h3, h3");
    private final By toastMsg        = By.cssSelector(".toast, [class*='toast']");

    public SettingsPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() { return WaitUtils.isVisible(driver, pageHeading, WAIT); }

    public int getSettingCardCount() {
        try { return driver.findElements(settingCards).size(); } catch (Exception e) { return 0; }
    }

    public int getToggleCount() {
        try { return driver.findElements(toggleSwitches).size(); } catch (Exception e) { return 0; }
    }

    public int getSectionHeadingCount() {
        try { return driver.findElements(sectionHeadings).size(); } catch (Exception e) { return 0; }
    }

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }

    // ── Interactions ───────────────────────────────────────────────────────

    /**
     * Toggle the first available checkbox/switch on the page.
     */
    public void toggleFirstSwitch() {
        List<WebElement> toggles = driver.findElements(toggleSwitches);
        if (!toggles.isEmpty()) {
            try {
                ((org.openqa.selenium.JavascriptExecutor) driver)
                    .executeScript("arguments[0].click();", toggles.get(0));
                log.info("First toggle switch clicked.");
            } catch (Exception e) { log.warn("Toggle click failed: " + e.getMessage()); }
        } else {
            log.warn("No toggle switches found on Settings page.");
        }
    }

    /**
     * Click the first save/submit button on the settings page.
     */
    public void clickSave() {
        List<WebElement> saveBtns = driver.findElements(saveButtons);
        if (!saveBtns.isEmpty()) {
            try {
                ((JavascriptExecutor) driver).executeScript("arguments[0].click();", saveBtns.get(0));
                log.info("Settings saved (JS click).");
            } catch (Exception e) {
                saveBtns.get(0).click();
                log.info("Settings saved.");
            }
        } else {
            // Last resort: find any save/submit button by text
            List<WebElement> all = driver.findElements(By.cssSelector("button"));
            for (WebElement b : all) {
                String t = b.getText().toLowerCase();
                if (t.contains("save") || t.contains("update")) {
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", b);
                    log.info("Settings saved (text-matched JS).");
                    return;
                }
            }
            log.warn("No save button found on Settings page.");
        }
    }

    /**
     * Change the first dropdown to the given option (by visible text).
     */
    public void changeFirstDropdown(String option) {
        List<WebElement> selects = driver.findElements(selectDropdowns);
        if (!selects.isEmpty()) {
            try {
                new org.openqa.selenium.support.ui.Select(selects.get(0))
                    .selectByVisibleText(option);
                log.info("Dropdown changed to: " + option);
            } catch (Exception e) { log.warn("Could not change dropdown: " + e.getMessage()); }
        } else {
            log.warn("No dropdowns found on Settings page.");
        }
    }
}
