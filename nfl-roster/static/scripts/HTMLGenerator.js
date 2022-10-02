class Page {
	constructor(data, pageNumber) {
		this.data = data;
		this.pageNumber = pageNumber;
	}
}

class HTMLGenerator {
	constructor(select) {
		this.select = select;
		this.rowSize = 3;
		this.pageSize = 9;
		this.pages = [];
		this.pageIndex = 0;
	}
	loading() {}

	createOptions(nicknames) {
		for (let name of nicknames) {
			const option = document.createElement("option");
			option.value = `${name}`;
			option.innerHTML = `${name}`;
			this.select.appendChild(option);
		}
	}

	createHeadShot(href, text, position) {
		const image = document.createElement("img");
		const card = document.createElement("div");
		const cardBody = document.createElement("div");
		const h5 = document.createElement("h5");
		const p = document.createElement("p");

		card.classList.add("card");
		card.classList.add("mt-5");
		cardBody.classList.add("card-body");
		cardBody.classList.add("text-center");
		h5.classList.add("card-title");
		p.classList.add("card-text");

		card.style.cssText = `width: 18rem !important;`;
		image.src = href;
		h5.innerText = position;
		p.innerText = text;

		card.appendChild(image);
		card.appendChild(cardBody);
		cardBody.appendChild(h5);
		cardBody.appendChild(p);
		return card;
	}

	createRow() {
		const row = document.createElement("div");
		row.classList.add("row");
		return row;
	}

	async createPages(results) {
		const pages = [];
		let data = [];
		let i = 0;
		let pageNumber = 1;
		for (let result of results) {
			const response = await fetch(result["$ref"]);
			const json = await response.json();
			if (i != 0 && i % this.pageSize === 0) {
				const page = new Page(data, pageNumber);
				pages.push(page);
				data = [];
				pageNumber++;
			}
			data.push(json);
			i++;
		}
		if (data.length > 0) {
			const page = new Page(data, ++pageNumber);
			pages.push(page);
		}

		return pages;
	}

	async createPagination(results) {
		const nav = document.createElement("nav");
		const ul = document.createElement("ul");
		nav.classList.add("m-5");
		ul.classList.add("pagination");
		for (let i = 1; i <= results.length; i++) {
			const li = document.createElement("li");
			const a = document.createElement("a");
			li.classList.add("page-item");
			li.classList.add("data-page");
			a.classList.add("page-link");
			a.href = "javascript:void(0)";
			a.addEventListener("click", () => {
				this.pageIndex = i - 1;
			});
			a.setAttribute("data-page", `${i - 1}`);
			a.innerText = i;
			li.appendChild(a);
			ul.appendChild(li);
		}
		nav.appendChild(ul);
		return nav;
	}

	async createGrid(pages) {
		const grid = document.createElement("div");
		let row;
		let i = 0;
		for (let athlete of pages[this.pageIndex].data) {
			if (row == null) {
				row = this.createRow();
			}
			const href = athlete?.headshot?.href;
			const fullName = athlete?.fullName;
			const position = athlete?.position.displayName;
			if (!href && !fullName && !position) continue;
			const headshot = await this.createHeadShot(href, fullName, position);
			headshot.classList.add("col");
			if (i % this.rowSize === 0 && i !== 0) {
				grid.appendChild(row);
				row = this.createRow();
			}
			row.append(headshot);
			i++;
		}
		row && grid.appendChild(row);
		const pagination = await this.createPagination(pages);
		grid.appendChild(pagination);
		return grid;
	}
}
