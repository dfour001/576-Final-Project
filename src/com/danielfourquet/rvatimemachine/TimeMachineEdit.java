package com.danielfourquet.rvatimemachine;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet(name = "TimeMachineEdit")
public class TimeMachineEdit extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String op = request.getParameter("op");

        if (op == "load") {
            load_user_data("TestUser", request, response);
        }


        if (op == "insert") {

        }

        if (op == "update") {

        }

        if op == "delete" {

        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    private void load_user_data(String userID, HttpServletRequest request, HttpServletResponse
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
        response.getWriter().write(json.toString());
    }
}
