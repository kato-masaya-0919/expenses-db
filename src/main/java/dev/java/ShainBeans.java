package dev.java;

import java.net.URI;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;

import javax.servlet.http.HttpServletRequest;


public class ShainBeans {

	private String id;
	private String name;
	private String sei;
	private String nen;
	private String address;

	// DB関連の初期設定
	private Connection conn = null;
	private PreparedStatement pstmt = null;

	// コンストラクタ
	public ShainBeans(HttpServletRequest request) {
		
		setId(request.getParameter("id"));
		setName(request.getParameter("name"));
		setSei(request.getParameter("sei"));
		setNen(request.getParameter("nen"));
		setAddress(request.getParameter("address"));
	}

	
	
	// データベースへのアクション
	private void doDataBase(String sql) throws Exception {
		
		// JDBC Driver の登録
		Class.forName("org.postgresql.Driver");
		 
		//
		URI dbUri = new URI(System.getenv("DATABASE_URL"));

		String username = dbUri.getUserInfo().split(":")[0];
		String password = dbUri.getUserInfo().split(":")[1];
		String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + dbUri.getPath();
		
		conn = DriverManager.getConnection(dbUrl, username, password);
		
		// sql文を表示
		System.out.println(sql);
		pstmt = conn.prepareStatement(sql);
		// sql文実行
		pstmt.execute();

		// 使用したオブジェクトを終了させる
		pstmt.close();
		conn.close();
	}

	// getter setter
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSei() {
		return sei;
	}

	public void setSei(String sei) {
		this.sei = sei;
	}

	public String getNen() {
		return nen;
	}

	public void setNen(String nen) {
		this.nen = nen;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	// 追加
	public Boolean addData() {
		try {

			// sql文 の作成
			String sql = "insert into shain_table(id, name, sei, nen, address) values ('" + id + "','" + name + "','"
					+ sei + "','" + nen + "','" + address + "')";

			// データベース接続＆ｓｑｌの実行
			doDataBase(sql);

			return true;

		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	//削除
	public Boolean deleteData() {
		try {

			// sql文 の作成
			String sql = "delete from shain_table where id=" + id;

			// データベース接続＆ｓｑｌの実行
			doDataBase(sql);

			return true;
			
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

}
