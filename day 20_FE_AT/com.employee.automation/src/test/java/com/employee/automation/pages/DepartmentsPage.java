package com.employee.automation.pages;

import com.employee.automation.utils.WaitUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

/**
 * DepartmentsPage - Page Object for the Admin Departments catalog module.
 * Covers: department card grid, drill-down to employee list, stats verification.
 */
public class DepartmentsPage {

    private static final Logger log = LogManager.getLogger(DepartmentsPage.class);
    private final WebDriver driver;
    private final int WAIT = 15;

    // ── Locators ───────────────────────────────────────────────────────────
    private final By pageHeading       = By.cssSelector("h2");
    private final By departmentCards   = By.cssSelector(".card:not(.stat-card)");
    private final By backToCatalogBtn  = By.cssSelector("button.btn-secondary");
    private final By deptTable         = By.cssSelector(".table, table");
    private final By tableRows         = By.cssSelector("tbody tr");
    private final By avgSalaryValues   = By.cssSelector("[class*='avg'], strong");
    private final By activeCountBadges = By.cssSelector("[class*='success']");
    private final By viewTeamLinks     = By.cssSelector(".card [class*='arrow'], .card > div:last-child");

    public DepartmentsPage(WebDriver driver) { this.driver = driver; }

    // ── Verifications ──────────────────────────────────────────────────────

    public boolean isPageLoaded() {
        return WaitUtils.isVisible(driver, pageHeading, WAIT);
    }

    public int getDepartmentCardCount() {
        try {
            List<WebElement> cards = driver.findElements(departmentCards);
            return cards.size();
        } catch (Exception e) { return 0; }
    }

    public boolean isDeptGridVisible() {
        return WaitUtils.isVisible(driver, departmentCards, WAIT);
    }

    public boolean isDeptTableVisible() {
        return WaitUtils.isVisible(driver, deptTable, 5);
    }

    public int getDrillDownRowCount() {
        try { return WaitUtils.waitForAllVisible(driver, tableRows, WAIT).size(); } catch (Exception e) { return 0; }
    }

    // ── Navigation ─────────────────────────────────────────────────────────

    /**
     * Click on the first department card to drill down into its employee list.
     */
    public void clickFirstDepartment() {
        List<WebElement> cards = driver.findElements(departmentCards);
        if (!cards.isEmpty()) {
            cards.get(0).click();
            WaitUtils.waitForVisible(driver, deptTable, WAIT);
            log.info("Drilled into first department.");
        } else {
            log.warn("No department cards found.");
        }
    }

    /**
     * Navigate back to the department catalog from a drill-down view.
     */
    public void goBackToCatalog() {
        try {
            WaitUtils.waitForClickable(driver, backToCatalogBtn, WAIT).click();
            log.info("Back to department catalog.");
        } catch (Exception e) { log.warn("Back to catalog button not found."); }
    }
}
