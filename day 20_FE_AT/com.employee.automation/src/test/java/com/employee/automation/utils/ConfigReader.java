package com.employee.automation.utils;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * ConfigReader - Singleton utility to load and access config.properties
 */
public class ConfigReader {

    private static final Logger log = LogManager.getLogger(ConfigReader.class);
    private static Properties properties;

    static {
        loadProperties();
    }

    private static void loadProperties() {
        properties = new Properties();
        // Try loading from project root first, then classpath
        String[] locations = {
            "config.properties",
            System.getProperty("user.dir") + "/config.properties"
        };

        for (String location : locations) {
            try (InputStream input = new FileInputStream(location)) {
                properties.load(input);
                log.info("Loaded config.properties from: " + location);
                return;
            } catch (IOException ignored) {
                // Try next location
            }
        }

        // Fallback: classpath
        try (InputStream input = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (input != null) {
                properties.load(input);
                log.info("Loaded config.properties from classpath.");
            } else {
                log.error("config.properties NOT FOUND in any location!");
            }
        } catch (IOException e) {
            log.error("Failed to load config.properties: " + e.getMessage());
        }
    }

    public static String get(String key) {
        String value = properties.getProperty(key);
        if (value == null) {
            log.warn("Property not found: " + key);
            return "";
        }
        return value.trim();
    }

    public static String getUrl()              { return get("url"); }
    public static String getAdminUsername()    { return get("admin.username"); }
    public static String getAdminPassword()    { return get("admin.password"); }
    public static String getEmployeeUsername() { return get("employee.username"); }
    public static String getEmployeePassword() { return get("employee.password"); }
    public static String getBrowser()          { return get("browser"); }
    public static boolean isHeadless()         { return Boolean.parseBoolean(get("headless")); }
    public static int getExplicitWait()        { return Integer.parseInt(get("explicit.wait")); }
    public static int getPageLoadTimeout()     { return Integer.parseInt(get("page.load.timeout")); }
    public static String getScreenshotDir()    { return get("screenshot.dir"); }
    public static String getReportDir()        { return get("report.dir"); }
    public static String getReportName()       { return get("report.name"); }
}
