package com.employee.automation.base;

import com.employee.automation.utils.ConfigReader;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.time.Duration;

/**
 * DriverFactory - Singleton WebDriver factory.
 * Opens Chrome ONCE for the entire test suite and reuses the same instance.
 */
public class DriverFactory {

    private static final Logger log = LogManager.getLogger(DriverFactory.class);
    private static WebDriver driver;

    private DriverFactory() {}

    /**
     * Initialize Chrome WebDriver once. If already initialized, return the existing instance.
     */
    public static WebDriver initDriver() {
        if (driver == null) {
            log.info("Initializing ChromeDriver via WebDriverManager...");
            WebDriverManager.chromedriver().setup();

            ChromeOptions options = new ChromeOptions();
            options.addArguments("--start-maximized");
            options.addArguments("--disable-notifications");
            options.addArguments("--disable-popup-blocking");
            options.addArguments("--disable-infobars");
            options.addArguments("--disable-extensions");
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            options.addArguments("--remote-allow-origins=*");

            if (ConfigReader.isHeadless()) {
                options.addArguments("--headless=new");
                options.addArguments("--window-size=1920,1080");
                log.info("Running in HEADLESS mode.");
            }

            driver = new ChromeDriver(options);
            driver.manage().timeouts().pageLoadTimeout(
                Duration.ofSeconds(ConfigReader.getPageLoadTimeout()));
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(0)); // Use explicit waits ONLY
            driver.manage().window().maximize();

            log.info("ChromeDriver initialized successfully.");
        } else {
            log.debug("Reusing existing ChromeDriver instance.");
        }
        return driver;
    }

    /**
     * Returns the existing WebDriver instance. Throws if not yet initialized.
     */
    public static WebDriver getDriver() {
        if (driver == null) {
            throw new IllegalStateException("WebDriver not initialized. Call initDriver() first.");
        }
        return driver;
    }

    /**
     * Quits the browser and resets the driver reference.
     */
    public static void quitDriver() {
        if (driver != null) {
            log.info("Quitting ChromeDriver...");
            driver.quit();
            driver = null;
            log.info("ChromeDriver terminated.");
        }
    }
}
