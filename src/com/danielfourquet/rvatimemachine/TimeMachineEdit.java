package com.danielfourquet.rvatimemachine;

import org.json.JSONArray;
import org.json.JSONObject;
import org.postgresql.util.PSQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.sql.ResultSet;

@MultipartConfig(maxFileSize = 1024 * 1024 * 2)
@WebServlet("/TimeMachineEdit")
public class TimeMachineEdit extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("-- TIMEMACHINEEDIT REACHED --");
        HttpSession session = request.getSession();

        // Determines the operation that needs to be performed (load, insert, update, or delete)
        String op = request.getParameter("op");
        System.out.println("op = " + op);

        // UserID
        String userID = (String)session.getAttribute("userID");


        if (op.equals("load")) {
            System.out.println("Loading data...");
            JSONObject data = load_user_data(userID, request, response);

            System.out.println("Returning data...");
            try {
                response.getWriter().write(data.toString());
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }


        if (op.equals("insert-image")) {
            insert_image(request, response, session);

        }

        if (op.equals("update")) {

        }

        if (op.equals("delete")) {
            delete_data(request, response, session);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    private JSONObject load_user_data(String userID, HttpServletRequest request, HttpServletResponse
            response) {
        JSONObject json = new JSONObject();
        DbUtil db = new DbUtil();

        try {
            // Get Images
            JSONArray imgList = db.get_images(userID);

            // Get Slideshows
            JSONArray slideshowList = db.get_slideshow(userID);

            // Get Neighborhoods
            JSONArray nList = new JSONArray();

            // Need Query r = db.queryDB("select id, year, title, description, username, imgurl, ST_Y(geom) lat, ST_X(geom) lng from slideshows");
            /*
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
            }*/
            // Temp Neighborhood Data
            JSONObject tmpJSON = new JSONObject();
            tmpJSON.put("name", "Court End");
            tmpJSON.put("count", "5");
            nList.put(tmpJSON);


            // Put all data into output JSON object
            json.put("images", imgList);
            json.put("slideshows", slideshowList);
            json.put("neighborhoods", nList);

        }
        catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("---- Data Returned ----");
        System.out.println(json.toString());
        // Return data to client

        return json;

    }

    private void insert_image(HttpServletRequest request, HttpServletResponse response, HttpSession session) throws IOException, ServletException {
        System.out.println("Inserting image...");
        // Prep attributes
        String year = request.getParameter("year");
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String direction = request.getParameter("direction");
        String username = (String)session.getAttribute("userID");
        String lat = request.getParameter("lat");
        String lng = request.getParameter("lng");
        Part image = request.getPart("imgFile");

        // This path will not work if put online.  This will need to be directed to a folder on the server
        String imgPath = request.getServletContext().getRealPath("") + "/images";

        // Save image to images folder
        if (image != null) {
            System.out.println("There's an image here!  It's: " + image.getName() + " " + image.getSubmittedFileName() + " " + image.getContentType());

            System.out.println("imgPath = " + imgPath);
            String fileName = image.getSubmittedFileName();

            // Create the file directory if it does not exists
            File fileDir = new File(imgPath);
            if (!fileDir.exists()) {
                fileDir.mkdirs();
            }

            // Save image file
            try {
                String fileExt = fileName.substring(fileName.length()-3);
                System.out.println(fileExt);
                if("jpg".equals(fileExt) || "png".equals(fileExt) || "gif".equals(fileExt)) {
                    image.write(imgPath + File.separator + fileName);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        imgPath = "images";
        // Build sql
        String sql = "insert into images (year, title, description, username, imgurl, direction, geom) "
                + "values (" + year + ", '" + title + "', '" + description + "', '" + username + "', '" + imgPath + "/" + image.getSubmittedFileName() + "', " + direction + ", ST_SetSRID(ST_Point(" + lng + "," + lat + "), 4326))";

        // Send request to database
        DbUtil db = new DbUtil();

        try {
            if (db.modifyDB(sql)) {
                session.setAttribute("message", "<span class='color-gold'>SUCCESS</span> - Image marker added to database.");
            }
            else {
                session.setAttribute("message", "ERROR - Unable to create point");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        try {
            response.sendRedirect("edit.jsp");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }


    private void delete_data(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        System.out.println("Deleting record...");

        // The record to be deleted
        String id = request.getParameter("id");
        String title = request.getParameter("title");

        // The table to delete from
        String table = request.getParameter("source");
        System.out.println("table = " + table);

        if (table.equals("images")) {
            String sql = "delete from images where id = " + id + " and title = '" + title + "'";

            // Send request to database
            DbUtil db = new DbUtil();

            try {
                if (db.modifyDB(sql)) {
                    session.setAttribute("message", "<span class='color-gold'>SUCCESS</span> - Image '" + title + "' deleted.");
                }
                else {
                    session.setAttribute("message", "ERROR - Unable to delete point");
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }

            try {
                response.sendRedirect("edit.jsp");
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        if (table.equals("slideshows")) {
            String sql = "delete from slideshows where id = " + id + " and title = '" + title + "'";

            // Send request to database
            DbUtil db = new DbUtil();

            try {
                if (db.modifyDB(sql)) {
                    session.setAttribute("message", "<span class='color-gold'>SUCCESS</span> - Slideshow '" + title + "' deleted.");
                }
                else {
                    session.setAttribute("message", "ERROR - Unable to delete point");
                }
            }
            catch (Exception e) {
                e.printStackTrace();
            }

            try {
                response.sendRedirect("edit.jsp");
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
