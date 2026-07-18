package com.employee.automation.utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * ExtentManager - Singleton managing ExtentReports lifecycle.
 * Supports thread-local ExtentTest to enable safe use across modules.
 */
public class ExtentManager {

    private static final Logger log = LogManager.getLogger(ExtentManager.class);
    private static ExtentReports extent;
    private static final ThreadLocal<ExtentTest> testThread = new ThreadLocal<>();

    /**
     * Initializes the ExtentReports instance with Spark HTML reporter.
     */
    public static synchronized void initReports() {
        if (extent == null) {
            String reportDir  = ConfigReader.getReportDir();
            String reportName = ConfigReader.getReportName();
            String timestamp  = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
            String reportPath = reportDir + File.separator + "EMS_Report_" + timestamp + ".html";

            new File(reportDir).mkdirs();

            ExtentSparkReporter spark = new ExtentSparkReporter(reportPath);
            spark.config().setTheme(Theme.DARK);
            spark.config().setDocumentTitle("EMS Automation Report");
            spark.config().setReportName("Employee Management System - Test Execution Report");
            spark.config().setEncoding("UTF-8");
            spark.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");

            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Framework",   "Selenium Java + TestNG + POM");
            extent.setSystemInfo("Browser",     "Google Chrome");
            extent.setSystemInfo("Environment", "Development");
            extent.setSystemInfo("Base URL",    ConfigReader.getUrl());
            extent.setSystemInfo("Author",      "EMS QA Team");

            log.info("ExtentReports initialized. Report path: " + reportPath);
        }
    }

    /**
     * Creates a new test node in the report.
     *
     * @param testName    Name of the test/module
     * @param description Short description of what is being tested
     * @param role        User role (Admin / Employee)
     * @return ExtentTest instance
     */
    public static ExtentTest createTest(String testName, String description, String role) {
        ExtentTest test = extent.createTest(
            "<b>[" + role + "]</b> " + testName,
            description
        );
        test.assignCategory(role);
        testThread.set(test);
        log.info("ExtentTest created: [" + role + "] " + testName);
        return test;
    }

    /**
     * Returns the current ExtentTest for this thread.
     */
    public static ExtentTest getTest() {
        return testThread.get();
    }

    /**
     * Cleans up the thread-local ExtentTest reference.
     */
    public static void removeTest() {
        testThread.remove();
    }

    /**
     * Flushes and writes the report to disk.
     */
    public static synchronized void flushReports() {
        if (extent != null) {
            extent.flush();
            log.info("ExtentReports flushed successfully.");
        }
    }
}
