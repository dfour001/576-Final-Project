import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class test {
    public static void main(String[] args) {
        Connection conn;
        Statement stmt;
        try {
            Class.forName("org.postgresql.Driver");
            String url = "jdbc:postgresql://localhost:5432/rvaTimeMachine";
            conn = DriverManager.getConnection(url, "postgres", "admin");

            // query the database
            String sql = "select id, year, title from images";
            stmt = conn.createStatement();
            ResultSet res = stmt.executeQuery(sql);

            // print the result
            if (res != null) {
                while (res.next()) {
                    System.out.println("id: " + res.getString("id"));
                    System.out.println("year: " + res.getString("year"));
                    System.out.println("title: " + res.getString("title"));
                }
            }

            // clean up
            stmt.close();
            conn.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        }
    }
