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
 * DocumentsPage - Page Object for the Company Documents / Document Management module.
 * Covers: file listing, search, category filter, upload modal (admin), download button.
 */
public class DocumentsPage {

    private static final Logger log = LogManager.getLogger(DocumentsPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading      = By.cssSelector("h2");
    private final By documentCards    = By.cssSelector(".card:not(.stat-card)");
    private final By searchInput      = By.cssSelector(".search-panel input, input[placeholder*='Search'], input[placeholder*='document']");
    private final By categoryFilter   = By.cssSelector("select");
    // Scoped to toolbar/header area — avoids accidentally matching .modal-content buttons
    private final By uploadBtn        = By.cssSelector(".toolbar button.btn-primary, .page-header button.btn-primary, .documents-header button.btn-primary, .documents-container > button.btn-primary");
    private final By downloadBtns     = By.cssSelector(".main-content button.btn-secondary.btn-sm, button.btn-secondary.btn-sm");
    private final By deleteButtons    = By.cssSelector("button.btn-ghost.btn-sm");
    private final By modalOverlay     = By.cssSelector(".modal-overlay");
    private final By inputFileName    = By.cssSelector("input[placeholder*='file'], input[placeholder*='name'], input[type='text']:first-of-type");
    private final By categorySelect   = By.cssSelector(".modal-content select:first-of-type");
    private final By fileTypeSelect   = By.cssSelector(".modal-content select:last-of-type");
    private final By descTextarea     = By.cssSelector("textarea");
    private final By submitBtn        = By.cssSelector("button[type='submit'], .modal-footer button.btn-primary");
    private final By cancelBtn        = By.cssSelector(".modal-footer button.btn-secondary");
    private final By emptyState       = By.cssSelector(".empty-state, .empty-text");

    public DocumentsPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        // Documents page has h2 or the search panel
        return WaitUtils.isVisible(driver, pageHeading, WAIT)
            || WaitUtils.isVisible(driver, searchInput, WAIT);
    }

    public int getDocumentCount() {
        try {
            List<WebElement> cards = driver.findElements(documentCards);
            return cards.size();
        } catch (Exception e) { return 0; }
    }

    public boolean isSearchBarVisible()    { return WaitUtils.isVisible(driver, searchInput, 5); }
    public boolean isCategoryFilterVisible(){ return WaitUtils.isVisible(driver, categoryFilter, 5); }
    public boolean isUploadBtnVisible()    { return WaitUtils.isVisible(driver, uploadBtn, 5); }

    public int getDownloadButtonCount() {
        try { return driver.findElements(downloadBtns).size(); } catch (Exception e) { return 0; }
    }

    // ── Search & Filter ────────────────────────────────────────────────────

    public void searchDocuments(String query) {
        try {
            WebElement input = WaitUtils.waitForVisible(driver, searchInput, WAIT);
            input.clear();
            input.sendKeys(query);
            log.info("Searched documents: " + query);
        } catch (Exception e) { log.warn("Search input not found."); }
    }

    public void clearSearch() {
        try {
            WebElement input = WaitUtils.waitForVisible(driver, searchInput, 5);
            input.clear();
        } catch (Exception e) { log.warn("Could not clear search."); }
    }

    public void filterByCategory(String category) {
        try {
            new org.openqa.selenium.support.ui.Select(
                WaitUtils.waitForVisible(driver, categoryFilter, WAIT)
            ).selectByVisibleText(category);
            log.info("Category filter applied: " + category);
        } catch (Exception e) { log.warn("Could not apply category filter: " + e.getMessage()); }
    }

    // ── Upload Actions (Admin) ─────────────────────────────────────────────

    public void clickUpload() {
        // First try scoped selector
        boolean clicked = false;
        try {
            WebElement btn = WaitUtils.waitForClickable(driver, uploadBtn, 5);
            ((JavascriptExecutor) driver).executeScript("arguments[0].click();", btn);
            clicked = true;
        } catch (Exception e) {
            log.warn("Scoped upload btn not found, scanning all btn-primary elements: " + e.getMessage());
        }

        // Fallback: scan all btn-primary buttons and find the one with upload/add text
        if (!clicked) {
            List<WebElement> allBtns = driver.findElements(By.cssSelector("button.btn-primary"));
            for (WebElement b : allBtns) {
                String txt = b.getText().toLowerCase();
                if (txt.contains("upload") || txt.contains("add document") || txt.contains("new document")) {
                    ((JavascriptExecutor) driver).executeScript("arguments[0].click();", b);
                    clicked = true;
                    break;
                }
            }
            if (!clicked) {
                log.error("Upload button not found on Documents page.");
                return;
            }
        }

        try { WaitUtils.waitForVisible(driver, modalOverlay, WAIT); } catch (Exception ignored) {}
        log.info("Upload document modal opened.");
    }

    public boolean isModalOpen() { return WaitUtils.isVisible(driver, modalOverlay, 5); }

    public void fillUploadForm(String fileName, String category, String desc) {
        try {
            WebElement nameEl = WaitUtils.waitForVisible(driver, inputFileName, 5);
            nameEl.clear(); nameEl.sendKeys(fileName);
        } catch (Exception e) { log.warn("File name input not found."); }

        try {
            new org.openqa.selenium.support.ui.Select(
                WaitUtils.waitForVisible(driver, categorySelect, 5)
            ).selectByVisibleText(category);
        } catch (Exception e) { log.warn("Category select not found."); }

        try {
            WebElement descEl = WaitUtils.waitForVisible(driver, descTextarea, 5);
            descEl.clear(); descEl.sendKeys(desc);
        } catch (Exception e) { log.warn("Description textarea not found."); }

        log.info("Upload form filled: " + fileName);
    }

    public void submitUpload() {
        WaitUtils.waitForClickable(driver, submitBtn, WAIT).click();
        log.info("Upload submitted.");
    }

    public void cancelUpload() {
        try { WaitUtils.waitForClickable(driver, cancelBtn, 5).click(); }
        catch (Exception e) { log.warn("Cancel button not found."); }
    }

    // ── Download ───────────────────────────────────────────────────────────

    public void clickFirstDownload() {
        List<WebElement> btns = driver.findElements(downloadBtns);
        if (!btns.isEmpty()) {
            btns.get(0).click();
            // Dismiss alert that fires on download simulation
            try { driver.switchTo().alert().accept(); } catch (Exception ignored) {}
            log.info("Download clicked for first document.");
        } else {
            log.warn("No download buttons found.");
        }
    }

    // ── Delete (Admin) ─────────────────────────────────────────────────────

    public void deleteFirstDocument() {
        List<WebElement> delBtns = driver.findElements(deleteButtons);
        if (!delBtns.isEmpty()) { delBtns.get(0).click(); log.info("First document deleted."); }
        else                    { log.warn("No delete buttons found."); }
    }
}
