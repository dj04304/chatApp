package com.cos.chatapp;

import java.time.LocalDateTime;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Scheduler;
import reactor.core.scheduler.Schedulers;

@RequiredArgsConstructor
@RestController
public class ChatContoller {

	private final ChatRepository chatRepository;
	
	//귓속말 할때 사용하면 된다.
//	@CrossOrigin  //자바스크립트 요청을 받을 수 있게끔 해줌
//	@GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
//	public Flux<Chat> getMsg(@PathVariable String sender, @PathVariable String receiver) {
//		return chatRepository.mFindBySender(sender, receiver)
//				.subscribeOn(Schedulers.boundedElastic());
//	}
	
	@CrossOrigin
	@GetMapping(value = "/chat/roomNum/{roomNum}",  produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<Chat> findByRoomNum(@PathVariable Integer roomNum) {
		return chatRepository.mFindByRoomNum(roomNum)
				.subscribeOn(Schedulers.boundedElastic());
	}
	
	@CrossOrigin
	@PostMapping("/chat")
	public Mono<Chat> setMsg(@RequestBody Chat chat) {
		chat.setCreatedAt(LocalDateTime.now());
		return chatRepository.save(chat); //Object를 리턴하면 자동으로 JSON 변환(MessageConverter)
	}
}
