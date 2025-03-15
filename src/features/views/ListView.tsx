import { useState, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { Container, Card, Text, Loader } from "@mantine/core";

const PAGE_SIZE = 20;

const fetchData = (offset: number) => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(
        Array.from({ length: PAGE_SIZE }, (_, i) => `Item ${offset + i + 1}`)
      );
    }, 1000);
  });
};

export function ListView() {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    setLoading(true);
    const newItems = await fetchData(items.length);
    setItems((prev) => [...prev, ...newItems]);
    setLoading(false);
  };

  return (
    <Container style={{ width: "100%", maxWidth: "600px" }}>
      <Virtuoso
        style={{ height: "400px", width: "600px" }}
        data={items}
        endReached={loadMore}
        itemContent={(index, item) => (
          <Card key={index} shadow="sm" padding="md" mb="sm">
            <Text>{item}</Text>
          </Card>
        )}
        components={{
          Footer: () =>
            loading ? (
              <div style={{ textAlign: "center", padding: "10px" }}>
                <Loader size="sm" />
              </div>
            ) : null,
        }}
      />
    </Container>
  );
}
