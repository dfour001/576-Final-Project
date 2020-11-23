package com.danielfourquet.rvatimemachine;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/TimeMachineEdit")
public class TimeMachineEdit extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("-- TIMEMACHINEEDIT REACHED --");
        HttpSession session = request.getSession();

        // Determines the operation that needs to be performed (load, insert, update, or delete)
        String op = request.getParameter("op");
        System.out.println("op = " + op);

        // UserID
        String userID = request.getParameter("userID");


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
            System.out.println("Inserting image...");
            // Prep attributes
            String year = request.getParameter("year");
            String title = request.getParameter("title");
            String description = request.getParameter("description");
            String direction = request.getParameter("direction");
            String username = (String)session.getAttribute("userID");
            String lat = request.getParameter("lat");
            String lng = request.getParameter("lng");

            // Build sql
            ///insert into images (year, title, description, username, direction, geom)
            //values (2020, 'tite', 'desc', 'TestUser', 180, ST_SetSRID(ST_Point(-75,35), 4326))
            String sql = "insert into images (year, title, description, usernamez, direction, geom) "
                    + "values (" + year + ", '" + title + "', '" + description + "', '" + username + "', " + direction + ", ST_SetSRID(ST_Point(" + lng + "," + lat + "), 4326))";

            // Send request to database
            DbUtil db = new DbUtil();

            try {
                db.modifyDB(sql);
            }
            catch (Exception e) {
                e.printStackTrace();
                session.setAttribute("message", "ERROR - Unable to create point");
                response.sendRedirect("edit.jsp");
            }

            session.setAttribute("message", "<span class='color-gold'>SUCCESS</span> - Image marker added to database.");
            response.sendRedirect("edit.jsp");

            // Reload edit.jsp



        }

        if (op.equals("update")) {

        }

        if (op.equals("delete")) {

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
            JSONArray imgList = db.get_images("TestUser");

            // Get Slideshows
            JSONArray slideshowList = db.get_slideshow("TestUser");

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
}
