package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * AnnouncementsPage - Page Object for both Admin (compose) and Employee (read) announcement flows.
 *
 * IMPORTANT: The Admin Announcements page uses an INLINE form on the left column — there is NO
 * modal-overlay popup for composing. The form is always visible for admin users.
 */
public class AnnouncementsPage {

    private static final Logger log = LogManager.getLogger(AnnouncementsPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────

    // The page has a two-column layout (admin): left = compose form card, right = feed
    // There is NO modal-overlay; the compose form is inline in the page.
    private final By pageHeading        = By.cssSelector("h3.card-title, h2, h1.topbar-title");

    // Inline compose form elements (admin only)
    private final By composeFormCard    = By.cssSelector(".card form");
    // Title input: "e.g. Q3 Corporate Guidelines Update"
    private final By inputTitle         = By.cssSelector(
        "input[placeholder*='Q3'], input[placeholder*='Title'], input[placeholder*='subject'], " +
        ".card form input[type='text']:not([placeholder*='mock']):not([placeholder*='pdf'])");
    // Textarea: "Write detailed announcements details here..."
    private final By textareaContent    = By.cssSelector(
        "textarea[placeholder*='detailed'], textarea[placeholder*='announcement'], textarea");
    // Submit button: "Broadcast Circular"
    private final By submitBtn          = By.cssSelector(
        "button[type='submit'].btn.btn-primary, .card form button[type='submit']");

    // Notice feed on the right column (or full width for employees)
    private final By noticeCards        = By.cssSelector(".card, .announcement-card, .notice-card");
    private final By searchInput        = By.cssSelector(
        "input[placeholder*='Search notices'], input[placeholder*='Search'], .search-panel input");
    private final By filterDropdown     = By.cssSelector("select");
    private final By pinnedBadge        = By.cssSelector(".badge[class*='pin'], [class*='pinned']");

    // There is no modal in Announcements.jsx — these are kept for compatibility but not used
    private final By modalOverlay       = By.cssSelector(".modal-overlay");

    private final By toastMsg           = By.cssSelector(".toast, [class*='toast']");
    private final By emptyState         = By.cssSelector(".empty-state, .empty-text");

    public AnnouncementsPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    /**
     * Page is loaded when notice cards appear OR the compose form card is visible.
     */
    public boolean isPageLoaded() {
        return WaitUtils.isVisible(driver, noticeCards, WAIT)
            || WaitUtils.isVisible(driver, composeFormCard, WAIT)
            || WaitUtils.isVisible(driver, emptyState, WAIT);
    }

    public int getNoticeCardCount() {
        try { return driver.findElements(noticeCards).size(); } catch (Exception e) { return 0; }
    }

    public boolean isSearchBarVisible() { return WaitUtils.isVisible(driver, searchInput, 5); }

    public void searchAnnouncement(String query) {
        try {
            WebElement input = WaitUtils.waitForVisible(driver, searchInput, 5);
            input.clear();
            input.sendKeys(query);
            log.info("Searched announcements: " + query);
        } catch (Exception e) { log.warn("Search bar not found."); }
    }

    // ── Admin: Inline Compose Form (NO modal) ──────────────────────────────

    /**
     * For the admin Announcements page, the compose form is always visible inline.
     * This method is a no-op (there's nothing to "click" to open a modal).
     * We just verify the form is present.
     */
    public void clickCompose() {
        // The form is already visible inline — no modal to open
        boolean formVisible = WaitUtils.isVisible(driver, composeFormCard, WAIT);
        log.info("Announce compose form visible (inline): " + formVisible);
    }

    /**
     * Returns true when the inline compose form is visible.
     * (No modal-overlay; form is always shown for admin users.)
     */
    public boolean isModalOpen() {
        // For compatibility: treat the inline compose form card as the "modal"
        return WaitUtils.isVisible(driver, composeFormCard, 5);
    }

    public void fillAnnouncementForm(String title, String content) {
        // Fill title
        try {
            WebElement titleEl = WaitUtils.waitForVisible(driver, inputTitle, WAIT);
            titleEl.clear();
            titleEl.sendKeys(title);
            log.info("Announcement title set: " + title);
        } catch (Exception e) {
            log.warn("Title field not found: " + e.getMessage());
        }

        // Fill content textarea
        try {
            WebElement contentEl = WaitUtils.waitForVisible(driver, textareaContent, WAIT);
            contentEl.clear();
            contentEl.sendKeys(content);
            log.info("Announcement content set.");
        } catch (Exception e) {
            log.warn("Content textarea not found: " + e.getMessage());
        }

        log.info("Announcement form filled: " + title);
    }

    public void submitAnnouncement() {
        try {
            WebElement btn = WaitUtils.waitForClickable(driver, submitBtn, WAIT);
            btn.click();
            // Brief wait for React state update
            try { Thread.sleep(500); } catch (InterruptedException ignored) {}
            log.info("Announcement submitted (Broadcast Circular clicked).");
        } catch (Exception e) {
            log.warn("Submit button not found: " + e.getMessage());
        }
    }

    public void cancelModal() {
        // No modal to cancel — form just resets on submit
        log.info("cancelModal() called — no-op for inline Announcements form.");
    }

    public boolean isToastVisible() { return WaitUtils.isVisible(driver, toastMsg, 5); }

    public int getPinnedCount() {
        try { return driver.findElements(pinnedBadge).size(); } catch (Exception e) { return 0; }
    }
}
