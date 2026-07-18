package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * ProjectsPage - Page Object for both Admin (manage) and Employee (view) projects module.
 */
public class ProjectsPage {

    private static final Logger log = LogManager.getLogger(ProjectsPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading     = By.cssSelector("h1.topbar-title, h2");
    private final By projectCards    = By.cssSelector(".card:not(.stat-card)");
    private final By statCards       = By.cssSelector(".card.stat-card, .stat-card");
    private final By addProjectBtn   = By.cssSelector(".toolbar button.btn-primary, .page-content > div > div > button.btn-primary, button.btn-primary");
    private final By projectForm     = By.cssSelector("form");
    private final By inputName       = By.cssSelector("input[placeholder*='Project'], input[placeholder*='project'], input[placeholder*='Name']");
    private final By inputDeadline   = By.cssSelector("input[type='date']");
    private final By textareaDesc    = By.cssSelector("textarea");
    // Actual DOM class in Projects.jsx: className="dept-bar-fill"
    private final By progressBars    = By.cssSelector(".dept-bar-fill");
    private final By statusBadges    = By.cssSelector(".badge");
    private final By deleteButtons   = By.cssSelector("button[title*='Remove'], button[title*='Delete']");
    private final By statusSelects   = By.cssSelector("select");
    private final By submitBtn       = By.cssSelector("button[type='submit'], form button.btn-primary");
    private final By emptyState      = By.cssSelector(".empty-state, .empty-text");
    private final By cancelBtn       = By.cssSelector("button.btn-secondary.btn-sm");

    public ProjectsPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        // Wait for the topbar title OR for an h2 (project toolbar heading)
        return WaitUtils.isVisible(driver, pageHeading, WAIT)
            || WaitUtils.isVisible(driver, statCards, WAIT);
    }

    public int getProjectCardCount() {
        try {
            List<WebElement> cards = driver.findElements(projectCards);
            // Filter only actual project cards (not stat-cards)
            return (int) cards.stream()
                .filter(c -> {
                    String cls = c.getAttribute("class");
                    return cls != null && !cls.contains("stat-card");
                }).count();
        } catch (Exception e) { return 0; }
    }

    public int getStatCardCount() {
        try { return WaitUtils.waitForAllVisible(driver, statCards, WAIT).size(); } catch (Exception e) { return 0; }
    }

    public boolean isProgressBarVisible() { return WaitUtils.isVisible(driver, progressBars, 5); }
    public boolean isStatusBadgeVisible() { return WaitUtils.isVisible(driver, statusBadges, 5); }
    public boolean isAddButtonVisible()   { return WaitUtils.isVisible(driver, addProjectBtn, 5); }

    public int getBadgeCount() {
        try { return driver.findElements(statusBadges).size(); } catch (Exception e) { return 0; }
    }

    // ── Admin Actions ──────────────────────────────────────────────────────

    public void clickAddProject() {
        WaitUtils.waitForClickable(driver, addProjectBtn, WAIT).click();
        WaitUtils.waitForVisible(driver, projectForm, WAIT);
        log.info("New Project form opened.");
    }

    public boolean isFormVisible() { return WaitUtils.isVisible(driver, projectForm, 5); }

    public void fillProjectForm(String name, String deadline, String desc) {
        try {
            WebElement nameEl = WaitUtils.waitForVisible(driver, inputName, 5);
            nameEl.clear(); nameEl.sendKeys(name);
        } catch (Exception e) { log.warn("Project name input not found."); }

        try {
            WebElement dlEl = WaitUtils.waitForVisible(driver, inputDeadline, 5);
            dlEl.clear(); dlEl.sendKeys(deadline);
        } catch (Exception e) { log.warn("Deadline input not found."); }

        try {
            WebElement descEl = WaitUtils.waitForVisible(driver, textareaDesc, 5);
            descEl.clear(); descEl.sendKeys(desc);
        } catch (Exception e) { log.warn("Description textarea not found."); }

        log.info("Project form filled: " + name);
    }

    public void submitProject() {
        WaitUtils.waitForClickable(driver, submitBtn, WAIT).click();
        log.info("Project form submitted.");
    }

    public void cancelForm() {
        try { WaitUtils.waitForClickable(driver, cancelBtn, 5).click(); }
        catch (Exception e) { log.warn("Cancel button not found."); }
    }

    public void changeFirstProjectStatus(String status) {
        List<WebElement> selects = driver.findElements(statusSelects);
        if (!selects.isEmpty()) {
            try {
                new org.openqa.selenium.support.ui.Select(selects.get(0))
                    .selectByVisibleText(status);
                log.info("Project status changed to: " + status);
            } catch (Exception e) { log.warn("Could not change project status."); }
        }
    }

    public void deleteFirstProject() {
        List<WebElement> delBtns = driver.findElements(deleteButtons);
        if (!delBtns.isEmpty()) { delBtns.get(0).click(); log.info("First project deleted."); }
        else                    { log.warn("No delete buttons found."); }
    }
}
