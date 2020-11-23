<%--
  Created by IntelliJ IDEA.
  User: danie
  Date: 11/22/2020
  Time: 3:36 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Log Out</title>
</head>
<body>
    <%
        session.setAttribute("userID", null);
        session.setAttribute("status",null);
        response.sendRedirect("index.jsp");
    %>
</body>
</html>
