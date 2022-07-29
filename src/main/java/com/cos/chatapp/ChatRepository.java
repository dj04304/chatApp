package com.cos.chatapp;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Tailable;

import reactor.core.publisher.Flux;

public interface ChatRepository extends ReactiveMongoRepository<Chat, String>{
	
	@Tailable // 커서를 안닫고 계속 유지한다.
	@Query("{sender: ?0, receiver: ?1}")
	Flux<Chat> mFindBySender(String sender, String receiver); //Flux 는 흐름을 말한다. 즉 response를 유지하면서 데이터를 계속 흘려보낼 수 있다.

	@Tailable
	@Query("{roomNum: ?0}")
	Flux<Chat> mFindByRoomNum(Integer roomNum);

}
