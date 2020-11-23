package com.danielfourquet.rvatimemachine;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.xml.transform.Result;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


public class DbUtil {
    // DB Connection info
    private static final String Driver = "org.postgresql.Driver";
    private static final String ConnUrl = "jdbc:postgresql://localhost:5432/rvaTimeMachine";
    private static final String Username = "postgres";
    private static final String Password = "admin";

    // Constructor
    public DbUtil() {

    }

    // create a Connection to the database
    private Connection connectDB() {
        Connection conn = null;
        try {
            Class.forName(Driver);
            conn = DriverManager.getConnection(ConnUrl, Username, Password);
            return conn;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    // execute a sql query (e.g. SELECT) and return a ResultSet
    public ResultSet queryDB(String sql) {
        Connection conn = connectDB();
        ResultSet res = null;
        try {
            if (conn != null) {
                Statement stmt = conn.createStatement();
                res = stmt.executeQuery(sql);
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return res;
    }

    // execute a sql query (e.g. INSERT) to modify the database;
    // no return value needed
    public boolean modifyDB(String sql) {
        Connection conn = connectDB();
        try {
            if (conn != null) {
                Statement stmt = conn.createStatement();
                stmt.execute(sql);
                stmt.close();
                conn.close();

            }
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }


    public static void main(String[] args) throws SQLException {
        DbUtil util = new DbUtil();

        ResultSet res = util.queryDB("select count(*) count from images;");
        if (res != null) {
            res.next();
            System.out.println("There are " + res.getString("count") + " images.");
        }

    }

    public JSONArray get_images(String UserIDFilter) {
        JSONArray imgList = new JSONArray();

        // Base sql query to return all image markers
        String sql = "select id, year, title, description, username, imgurl, direction, ST_Y(geom) lat, ST_X(geom) lng from images";

        // If filtering by user name (in edit mode), add where clause
        if (UserIDFilter != null) {
                sql += " where username = '" + UserIDFilter + "'";
        }

        System.out.println(sql);

        // Send query to database
        ResultSet r = queryDB(sql);

        // Build imgList json array containing images
        try {
            if (r != null) {
                while (r.next()) {
                    JSONObject img = new JSONObject();
                    img.put("id", r.getString("id"));
                    img.put("year", r.getString("year"));
                    img.put("title", r.getString("title"));
                    img.put("description", r.getString("description"));
                    img.put("userName", r.getString("username"));
                    img.put("imgURL", r.getString("imgurl"));
                    img.put("direction", r.getString("direction"));
                    img.put("lat", r.getString("lat"));
                    img.put("lng", r.getString("lng"));
                    imgList.put(img);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return imgList;
    }

    public JSONArray get_slideshow(String UserIDFilter) {
        JSONArray slideshowList = new JSONArray();

        // Base sql query to return all image markers
        String sql = "select id, year, title, description, username, imgurl, ST_Y(geom) lat, ST_X(geom) lng from slideshows";

        // If filtering by user name (in edit mode), add where clause
        if (UserIDFilter == null) {
            sql += " where username = '" + UserIDFilter + "'";
        }

        // Send query to database
        ResultSet r = queryDB(sql);

        // Build slideshowList json array containing images
        try {
            if (r != null) {
                while (r.next()) {
                    JSONObject s = new JSONObject();
                    s.put("id", r.getString("id"));
                    s.put("year", r.getString("year"));
                    s.put("title", r.getString("title"));
                    s.put("description", r.getString("description"));
                    s.put("username", r.getString("username"));
                    s.put("imgurl", r.getString("imgurl"));
                    s.put("lat", r.getString("lat"));
                    s.put("lng", r.getString("lng"));
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return slideshowList;
    }
}
