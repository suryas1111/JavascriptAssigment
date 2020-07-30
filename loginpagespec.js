describe("Login Test", ()=>{

	it("Correct username,Correct password",()=>{
		let username="user";
		let password="web_dev";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("Incorrect username,incorrect password",()=>{
		let username="user1";
		let password="web_dev1";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("Incorrect username,correct password",()=>{
		let username="user1";
		let password="web_dev";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("correct username,incorrect password",()=>{
		let username="user";
		let password="web_dev1";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("valid username and empty password",()=>{
		let username="user";
		let password="";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("empty username and valid password",()=>{
		let username="";
		let password="web_dev";
		expect(checkCredentials(username,password)).toBe(true);

	});

	it("case changed username /password",()=>{
		let username="User";
		let password="Web_dev";
		expect(checkCredentials(username,password)).toBe(true);

	});

});