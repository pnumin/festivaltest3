async function fetchAPI() {
  const url = "https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=8qw7g%2FC%2BMGd2iRqEvb%2FEx0Sg3ZwAAsnS%2FQ7rRaU3l4UUYfNWgyAbYpNw541yy9pueEvoCcNwmCww8ss32BBWEA%3D%3D&pageNo=1&numOfRows=1&resultType=json";
  const res = await fetch(url);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
fetchAPI();
