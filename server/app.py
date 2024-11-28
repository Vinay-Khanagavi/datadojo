import uuid
from datetime import datetime
import chromadb
from typing import Dict, Any, List

class DSASocraticChatbotTracker:
    def __init__(self, db_path: str = "./dsa_interaction_db"):
        """Initialize the vector database for tracking DSA chatbot interactions"""
        # Initialize ChromaDB client
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        
        # Create or get the collection for DSA interactions
        self.collection = self.chroma_client.get_or_create_collection(
            name="dsa_interactions",
            metadata={"hnsw:space": "cosine"}
        )
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate a simple embedding (placeholder method)"""
        return [float(ord(char)) for char in text[:10]]  # Simple character-based embedding
    
    def add_interaction(self, interaction_details: Dict[str, Any]) -> str:
        """Add a new interaction record to the vector database"""
        interaction_id = str(uuid.uuid4())
        
        metadata = {
            "user_id": interaction_details.get("user_id", "anonymous"),
            "timestamp": datetime.now().isoformat(),
            "question_topic": interaction_details.get("question_topic", ""),
            "difficulty_level": interaction_details.get("difficulty_level", ""),
            "conversation_length": interaction_details.get("conversation_length", 0),
            "learning_outcome": interaction_details.get("learning_outcome", "")
        }
        
        embeddings_text = (
            f"{interaction_details.get('question', '')} "
            f"{interaction_details.get('question_topic', '')} "
            f"{interaction_details.get('learning_outcome', '')}"
        )
        
        embedding = self.generate_embedding(embeddings_text)
        
        self.collection.add(
            ids=[interaction_id],
            embeddings=[embedding],
            metadatas=[metadata],
            documents=[embeddings_text]
        )
        
        # ADDED: Detailed print statements to show what was added
        print("\n📝 New Interaction Added:")
        print(f"ID: {interaction_id}")
        print(f"Metadata: {metadata}")
        print(f"Embedding Text: {embeddings_text}")
        
        return interaction_id
    
    def retrieve_similar_interactions(self, query: str, n_results: int = 5) -> List[Dict]:
        """Retrieve similar past interactions"""
        query_embedding = self.generate_embedding(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # ADDED: Detailed print statements to show retrieved interactions
        print(f"\n🔍 Searching for interactions similar to: '{query}'")
        print("Retrieved Interactions:")
        for i, (doc, meta, dist) in enumerate(zip(
            results['documents'][0], 
            results['metadatas'][0], 
            results['distances'][0]
        ), 1):
            print(f"\nResult {i}:")
            print(f"  Document: {doc}")
            print(f"  Metadata: {meta}")
            print(f"  Similarity Distance: {dist}")
        
        return results
    
    def get_interaction_stats(self) -> Dict[str, Any]:
        """Get overall statistics about DSA interactions"""
        total_interactions = self.collection.count()
        
        # ADDED: More detailed statistics
        stats = {
            "total_interactions": total_interactions,
            "interaction_topics": self._get_topic_distribution(),
            "difficulty_levels": self._get_difficulty_distribution()
        }
        
        # Print statistics
        print("\n📊 Interaction Statistics:")
        print(f"Total Interactions: {stats['total_interactions']}")
        print("Topics Distribution:", stats['interaction_topics'])
        print("Difficulty Levels:", stats['difficulty_levels'])
        
        return stats
    
    def _get_topic_distribution(self):
        """Helper method to get distribution of interaction topics"""
        topics = {}
        for metadata in self.collection.get(include=['metadatas'])['metadatas']:
            topic = metadata.get('question_topic', 'Unknown')
            topics[topic] = topics.get(topic, 0) + 1
        return topics
    
    def _get_difficulty_distribution(self):
        """Helper method to get distribution of difficulty levels"""
        difficulties = {}
        for metadata in self.collection.get(include=['metadatas'])['metadatas']:
            difficulty = metadata.get('difficulty_level', 'Unknown')
            difficulties[difficulty] = difficulties.get(difficulty, 0) + 1
        return difficulties

def main():
    # Initialize the tracker
    tracker = DSASocraticChatbotTracker()
    
    # Example interactions
    interactions = [
        {
            "user_id": "student_123",
            "question": "How does binary search work?",
            "question_topic": "Searching Algorithms",
            "difficulty_level": "Intermediate",
            "conversation_length": 5,
            "learning_outcome": "Understood binary search algorithm and implementation"
        },
        {
            "user_id": "student_456",
            "question": "Explain merge sort algorithm",
            "question_topic": "Sorting Algorithms",
            "difficulty_level": "Advanced",
            "conversation_length": 7,
            "learning_outcome": "Learned merge sort steps and complexity"
        }
    ]
    
    # Add multiple interactions
    for interaction in interactions:
        interaction_id = tracker.add_interaction(interaction)
    
    # Retrieve similar interactions
    tracker.retrieve_similar_interactions("search algorithms")
    
    # Get overall stats
    tracker.get_interaction_stats()

if __name__ == "__main__":
    main()