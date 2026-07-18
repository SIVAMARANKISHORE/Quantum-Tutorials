package com.employee.automation.listeners;

import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.MediaEntityBuilder;
import com.aventstack.extentreports.Status;
import com.employee.automation.base.DriverFactory;
import com.employee.automation.utils.ExtentManager;
import com.employee.automation.utils.ScreenshotUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestListener;
import org.testng.ITestResult;

/**
 * TestListeners - Hooks into TestNG lifecycle to:
 *  - Log pass/fail/skip status into ExtentReports
 *  - Capture and embed a screenshot on test failure
 *  - Log execution time for every test
 */
public class TestListeners implements ITestListener {

    private static final Logger log = LogManager.getLogger(TestListeners.class);

    @Override
    public void onTestStart(ITestResult result) {
        log.info("──────────────────────────────────────────────");
        log.info("TEST START: " + result.getName());
        log.info("──────────────────────────────────────────────");
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        long duration = result.getEndMillis() - result.getStartMillis();
        log.info("✅ TEST PASSED: " + result.getName() + " [" + duration + " ms]");

        ExtentTest test = ExtentManager.getTest();
        if (test != null) {
            // Attach success screenshot
            WebDriver driver = getDriver();
            if (driver != null) {
                String b64 = ScreenshotUtil.captureBase64Screenshot(driver);
                if (b64 != null) {
                    try {
                        test.pass("Test passed in " + duration + " ms",
                            MediaEntityBuilder.createScreenCaptureFromBase64String(b64).build());
                    } catch (Exception e) {
                        test.pass("Test passed in " + duration + " ms");
                    }
                } else {
                    test.pass("Test passed in " + duration + " ms");
                }
            } else {
                test.pass("Test passed in " + duration + " ms");
            }
        }
    }

    @Override
    public void onTestFailure(ITestResult result) {
        long duration = result.getEndMillis() - result.getStartMillis();
        String reason = result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown error";
        log.error("❌ TEST FAILED: " + result.getName() + " [" + duration + " ms]");
        log.error("   Reason: " + reason);

        ExtentTest test = ExtentManager.getTest();
        if (test != null) {
            // Attach failure screenshot
            WebDriver driver = getDriver();
            if (driver != null) {
                String b64 = ScreenshotUtil.captureBase64Screenshot(driver);
                if (b64 != null) {
                    try {
                        test.fail("Test FAILED in " + duration + " ms | Reason: " + reason,
                            MediaEntityBuilder.createScreenCaptureFromBase64String(b64).build());
                    } catch (Exception e) {
                        test.fail("Test FAILED in " + duration + " ms | Reason: " + reason);
                        test.fail(result.getThrowable());
                    }
                } else {
                    test.fail("Test FAILED: " + reason);
                    test.fail(result.getThrowable());
                }
            } else {
                test.fail("Test FAILED: " + reason);
            }
        }
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log.warn("⚠️ TEST SKIPPED: " + result.getName());
        ExtentTest test = ExtentManager.getTest();
        if (test != null) {
            test.skip("Test was SKIPPED: " + result.getThrowable().getMessage());
        }
    }

    @Override
    public void onTestFailedButWithinSuccessPercentage(ITestResult result) {
        log.warn("⚠️ TEST FAILED WITHIN SUCCESS PERCENTAGE: " + result.getName());
    }

    private WebDriver getDriver() {
        try {
            return DriverFactory.getDriver();
        } catch (Exception e) {
            return null;
        }
    }
}
