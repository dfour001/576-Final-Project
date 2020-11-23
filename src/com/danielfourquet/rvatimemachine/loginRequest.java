package com.danielfourquet.rvatimemachine;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.ResultSet;

@WebServlet("/loginRequest")
public class loginRequest extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("-- LOGIN REQUEST REACHED --");
        String userID = request.getParameter("userID");
        String password = request.getParameter("password");
        HttpSession session = request.getSession();

        // Verify username and password
        String sql = "select * from users where username = '" + userID + "' and password = '" + password + "'";
        DbUtil db = new DbUtil();
        ResultSet r = db.queryDB(sql);
        try {

            // If correct - set session username and redirect to editing page
            if (r.next()) {
                System.out.println("r.next()");
                session.setAttribute("userID", userID);
                session.setAttribute("status", "success");
                response.sendRedirect(request.getContextPath() + "edit.jsp");
            }

            // If incorrect - send back to login page with error message
            else {
                System.out.println("not r.next()");
                session.setAttribute("status", "error");
                response.sendRedirect("error.jsp");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }





    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
