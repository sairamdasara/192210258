@RestController
@RequestMapping("/numbers")
public class NumberController {

    private static final int WINDOW_SIZE = 10;
    private final Deque<Integer> numberWindow = new LinkedList<>();

    private final Map<String, String> apiUrls = Map.of(
        "p", "http://20.244.56.144/evaluation-service/primes",
        "f", "http://20.244.56.144/evaluation-service/fibo",
        "e", "http://20.244.56.144/evaluation-service/even",
        "r", "http://20.244.56.144/evaluation-service/rand"
    );

    @GetMapping("/{numberid}")
    public ResponseEntity<Map<String, Object>> getNumbers(@PathVariable String numberid) {
        if (!apiUrls.containsKey(numberid)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid number ID"));
        }

        List<Integer> prevState = new ArrayList<>(numberWindow);
        List<Integer> fetchedNumbers = fetchNumbers(apiUrls.get(numberid));
        
        for (Integer num : fetchedNumbers) {
            if (!numberWindow.contains(num)) {
                if (numberWindow.size() >= WINDOW_SIZE) {
                    numberWindow.pollFirst(); // remove oldest
                }
                numberWindow.addLast(num);
            }
        }

        double avg = numberWindow.isEmpty() ? 0.0 :
                     numberWindow.stream().mapToInt(Integer::intValue).average().orElse(0.0);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("windowPrevState", prevState);
        response.put("windowCurrState", numberWindow);
        response.put("numbers", fetchedNumbers);
        response.put("avg", Math.round(avg * 100.0) / 100.0);

        return ResponseEntity.ok(response);
    }

    private List<Integer> fetchNumbers(String url) {
        try {
            HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(500))
                .build();

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofMillis(500))
                .GET()
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            ObjectMapper mapper = new ObjectMapper();
            Map<String, List<Integer>> map = mapper.readValue(response.body(), new TypeReference<>() {});
            return map.getOrDefault("numbers", List.of());

        } catch (Exception e) {
            return List.of(); // ignore errors or timeouts
        }
    }
}