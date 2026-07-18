package com.employee.automation.utils;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ScreenshotUtil - Captures screenshots and saves them to the reports/screenshots directory.
 * Returns the absolute file path for embedding in Extent Reports.
 */
public class ScreenshotUtil {

    private static final Logger log = LogManager.getLogger(ScreenshotUtil.class);
    private static final String SCREENSHOT_DIR = ConfigReader.getScreenshotDir();

    /**
     * Captures a screenshot and saves it to the reports/screenshots folder.
     *
     * @param driver WebDriver instance
     * @param name   A descriptive name for the screenshot (e.g. "Admin_Dashboard")
     * @return Absolute path of the saved screenshot, or null on failure
     */
    public static String captureScreenshot(WebDriver driver, String name) {
        if (driver == null) {
            log.warn("WebDriver is null. Cannot take screenshot.");
            return null;
        }

        try {
            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String safeName  = name.replaceAll("[^a-zA-Z0-9_\\-]", "_");
            String fileName  = safeName + "_" + timestamp + ".png";

            File screenshotDir = new File(SCREENSHOT_DIR);
            if (!screenshotDir.exists()) {
                screenshotDir.mkdirs();
            }

            File destFile = new File(screenshotDir.getAbsolutePath() + File.separator + fileName);
            File srcFile  = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            FileUtils.copyFile(srcFile, destFile);

            log.info("Screenshot saved: " + destFile.getAbsolutePath());
            return destFile.getAbsolutePath();

        } catch (IOException e) {
            log.error("Failed to save screenshot: " + e.getMessage());
            return null;
        }
    }

    /**
     * Captures a screenshot as a Base64 encoded string for inline embedding in reports.
     *
     * @param driver WebDriver instance
     * @return Base64 screenshot string, or null on failure
     */
    public static String captureBase64Screenshot(WebDriver driver) {
        if (driver == null) {
            log.warn("WebDriver is null. Cannot take Base64 screenshot.");
            return null;
        }
        try {
            return ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);
        } catch (Exception e) {
            log.error("Failed to capture Base64 screenshot: " + e.getMessage());
            return null;
        }
    }
}
