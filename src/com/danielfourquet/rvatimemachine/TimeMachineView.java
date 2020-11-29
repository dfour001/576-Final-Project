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
import java.util.HashMap;

@WebServlet("/TimeMachineView")
public class TimeMachineView extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject json = new JSONObject();
        DbUtil db = new DbUtil();
        try {
            // Get Images
            JSONArray imgList = db.get_images(null);

            // Get Slideshows
            JSONArray slideshowList = db.get_slideshow(null);

            // Get Neighborhoods
            JSONArray nList = db.get_neighborhoods();

            // Put all data into output JSON object
            json.put("images", imgList);
            json.put("slideshows", slideshowList);
            json.put("neighborhoods", nList);

        }
        catch (Exception e) {
            e.printStackTrace();
        }

        System.out.println("---- Data Returned ----");

        // Return data to client
        response.getWriter().write(json.toString());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
