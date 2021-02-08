package com.wwe.project.model.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.wwe.common.code.ErrorCode;
import com.wwe.common.exception.DataAccessException;
import com.wwe.common.jdbc.JDBCTemplate;
import com.wwe.member.model.vo.Member;
import com.wwe.project.model.vo.Project;

public class ProDao {
	
	JDBCTemplate jdt = JDBCTemplate.getInstance();
	
	//새 프로젝트 생성해서 DB에 추가
	public int insertNewProject(Connection conn, Project project) {
	      int res = 0;
	      PreparedStatement pstm = null;
	      
	      try {
	    	 String sql = "insert into tb_project "
		    		  	+ "(project_id, due_date, progress, leader_id) "
		    		  	+ "values(?, ?, 0, ?)";
    	  
	         pstm = conn.prepareStatement(sql);
	         pstm.setString(1, project.getProjectId());
	         pstm.setDate(2, project.getDueDate());
	         pstm.setString(3, project.getLeaderId());
	         res = pstm.executeUpdate();
	         
	      } catch (SQLException e) {
	         throw new DataAccessException(ErrorCode.IB01, e); 
	
	      }finally {
	    	  jdt.close(pstm);
	      }
	      
	      //성공하면 1, 실패하면 0 반환
	      //(1은 쿼리를 실행한 횟수)
	      return res;
	   }
	
	//새 프로젝트의 참여자 - DB에서 아이디로 식별해 가져오고, 보여주는 건 이름
	public Member selectMember(Connection conn, String userId, String userName) {
		Member member = new Member();
		PreparedStatement pstm = null;
		ResultSet rset = null;
		
		try{
			String query = "select * from tb_user "
							+ "where user_id = ? and user_name = ?";
			
			//주소창처럼 => 아이디로 입력을 받고, 이 아이디로 검색해서 추가
			pstm = conn.prepareStatement(query);
			pstm.setString(1, member.getUserID());
			pstm.setString(2, member.getUserName());
			
			rset = pstm.executeQuery();
			
		} catch (SQLException e) {
			throw new DataAccessException(ErrorCode.SM01, e);
		}finally {
			jdt.close(rset,pstm);
		}
		
		return member;
	}

	//최근 프로젝트 받아오기 (최근 작업시간 순으로)
	public ArrayList<Project> selectRecentProject(Connection conn, String userId){
		ArrayList<Project> recentProject = new ArrayList<>();
		PreparedStatement pstm = null;
		ResultSet rset = null;
		
		try{
			String query = "select user_id, project_id, work_time "
							+ "from tb_project_master"
							+ "where user_id = ?"
							+ "order by work_time desc";
	
			//= sql에 쿼리 입력
			pstm = conn.prepareStatement(query);
			pstm.setString(1, userId);

			//= sql의 쿼리 실행
			rset = pstm.executeQuery();
			
			//쿼리를 실행해서 얻은 데이터가 다음값이 없을 때까지(= false) 반복
			while(rset.next()) {
				Project project = new Project();
				project.setUserId(rset.getString("user_id"));
				project.setProjectId(rset.getString("project_id"));
				project.setWorkTime(rset.getDate("work_time"));
				
				//얻어진 project 객체를 list에 붙임
				recentProject.add(project);
			}
			
		} catch (SQLException e) {
			throw new DataAccessException(ErrorCode.SM01, e);
			
		}finally {
			jdt.close(rset,pstm);
		}
		
		return recentProject;
	}
	
	
	//초대된 프로젝트 받아오기
	public ArrayList<Project> selectInvitedProject(Connection conn, String userId, String isInvited) {
		ArrayList<Project> projectList = new ArrayList<>();
		PreparedStatement pstm = null;
		ResultSet rset = null;
		
		try {
			String query = "select * from tb_user_issue "
						 + "where user_id = ? and is_invited = ?";
			
			pstm = conn.prepareStatement(query);
			pstm.setString(1, userId);
			pstm.setString(2, isInvited);
			
			rset = pstm.executeQuery();
			
			while(rset.next()) {
				Project project = new Project();
				project.setUserId(rset.getString("user_id"));
				project.setProjectId(rset.getString("project_id"));
				project.setIsInvited(rset.getString("is_invited"));
				
				projectList.add(project);
			}
			
		} catch (SQLException e) {
			throw new DataAccessException(ErrorCode.SM01, e);
		}finally {
			jdt.close(rset,pstm);
		}
		
		return projectList;
	}
}
