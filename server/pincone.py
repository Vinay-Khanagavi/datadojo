import uuid
from datetime import datetime
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import numpy as np
import json

class DSASocraticChatbotTracker:
    def __init__(self, 
                api_key: str = "pcsk_38dKbo_MKaeMXd1YJbKFKHqinRbHGgisskMkMZ3rvhWpzYNmRcFCsXR8Cc6mSBv48BDbDQ", 
                index_name: str = "dsa-interactions"):
        try:
            # Initialize Pinecone client
            self.pc = Pinecone(api_key=api_key)
            
            # Delete existing index if it exists
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            if index_name in existing_indexes:
                print(f"Deleting existing index: {index_name}")
                self.pc.delete_index(index_name)
            
            # Create new index with correct dimension
            print(f"Creating new index: {index_name}")
            self.pc.create_index(
                name=index_name,
                dimension=384,  # Correct dimension for all-MiniLM-L6-v2
                metric="cosine",
                spec=ServerlessSpec(
                    cloud="aws",
                    region="us-east-1"
                )
            )
            print(f"Index {index_name} created successfully.")
            
            # Get the index
            self.index = self.pc.Index(index_name)
            
            # Rest of the initialization remains the same
            self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.index_name = index_name
            
        except Exception as e:
            print(f"Error initializing Pinecone: {e}")
            raise

    
    def generate_embedding(self, text: str) -> np.ndarray:
        """
        Generate embedding for the input text
        
        Args:
            text (str): Input text to embed
        
        Returns:
            np.ndarray: Embedding vector
        """
        return self.embedding_model.encode(text)
    
    def add_interaction(self, interaction_details: dict) -> str:
        """
        Add a new interaction record to Pinecone
        
        Args:
            interaction_details (dict): Dictionary containing interaction metadata
        
        Returns:
            str: Unique identifier for the added interaction
        """
        try:
            # Generate unique ID
            interaction_id = str(uuid.uuid4())
            
            # Prepare metadata
            metadata = {
                "user_id": interaction_details.get("user_id", "anonymous"),
                "timestamp": datetime.now().isoformat(),
                "question_topic": interaction_details.get("question_topic", ""),
                "difficulty_level": interaction_details.get("difficulty_level", ""),
                "conversation_length": str(interaction_details.get("conversation_length", 0)),
                "learning_outcome": interaction_details.get("learning_outcome", "")
            }
            
            # Prepare text for embedding
            embeddings_text = (
                f"{interaction_details.get('question', '')} "
                f"{interaction_details.get('question_topic', '')} "
                f"{interaction_details.get('learning_outcome', '')}"
            )
            
            # Generate embedding
            embedding = self.generate_embedding(embeddings_text)
            
            # Convert embedding to list for Pinecone
            embedding_list = embedding.tolist()
            
            # Upsert to Pinecone
            self.index.upsert(
                vectors=[
                    (
                        interaction_id,  # Vector ID
                        embedding_list,  # Embedding vector
                        metadata  # Metadata
                    )
                ]
            )
            
            # Print details of added interaction
            print("\n📝 New Interaction Added:")
            print(f"ID: {interaction_id}")
            print(f"Metadata: {json.dumps(metadata, indent=2)}")
            print(f"Embedding Length: {len(embedding_list)}")
            
            return interaction_id
        
        except Exception as e:
            print(f"Error adding interaction: {e}")
            return None
    
    def retrieve_similar_interactions(self, query: str, n_results: int = 5) -> list:
        """
        Retrieve similar past interactions
        
        Args:
            query (str): Search query
            n_results (int): Number of similar interactions to retrieve
        
        Returns:
            list: List of similar interactions
        """
        try:
            # Generate embedding for the query
            query_embedding = self.generate_embedding(query)
            
            # Convert to list for Pinecone
            query_embedding_list = query_embedding.tolist()
            
            # Query Pinecone
            results = self.index.query(
                vector=query_embedding_list,
                top_k=n_results,
                include_metadata=True
            )
            
            # Print retrieved interactions
            print(f"\n🔍 Searching for interactions similar to: '{query}'")
            print("Retrieved Interactions:")
            for i, match in enumerate(results['matches'], 1):
                print(f"\nResult {i}:")
                print(f"  ID: {match['id']}")
                print(f"  Score: {match['score']}")
                print(f"  Metadata: {json.dumps(match.get('metadata', {}), indent=2)}")
            
            return results['matches']
        
        except Exception as e:
            print(f"Error retrieving interactions: {e}")
            return []
    
    def get_interaction_stats(self) -> dict:
        """
        Get overall statistics about DSA interactions
        
        Returns:
            dict: Statistics about interactions
        """
        try:
            # Retrieve index stats
            index_stats = self.index.describe_index_stats()
            
            # Get total vector count
            total_interactions = index_stats.get('total_vector_count', 0)
            
            # Print statistics
            print("\n📊 Interaction Statistics:")
            print(f"Total Interactions: {total_interactions}")
            
            return {
                "total_interactions": total_interactions
            }
        
        except Exception as e:
            print(f"Error getting interaction stats: {e}")
            return {"total_interactions": 0}

def main():
    tracker = DSASocraticChatbotTracker()
    
    interactions = [
        {
            "user_id": "vinay@gmail.com",
            "question": "How does binary search work?",
            "question_topic": "Searching Algorithms",
            "difficulty_level": "Intermediate",
            "conversation_length": 5,
            "learning_outcome": "Understood binary search algorithm and implementation"
        },
        {
            "user_id": "Reachupalhere@gmail.com",
            "question": "Explain merge sort algorithm",
            "question_topic": "Sorting Algorithms",
            "difficulty_level": "Advanced",
            "conversation_length": 7,
            "learning_outcome": "Learned merge sort steps and complexity"
        },
        {
            "user_id": "abc@abc.com",
            "question": "What is a linked list?",
            "question_topic": "Data Structures",
            "difficulty_level": "Beginner",
            "conversation_length": 4,
            "learning_outcome": "Understood basic linked list structure"
        },
        {
            "user_id": "abcd@abc.com",
            "question": "Implement depth-first search",
            "question_topic": "Graph Algorithms",
            "difficulty_level": "Advanced",
            "conversation_length": 8,
            "learning_outcome": "Learned DFS implementation and traversal technique"
        },
        {
            "user_id": "cr7@gmai1.com",
            "question": "Time complexity of quicksort",
            "question_topic": "Algorithm Complexity",
            "difficulty_level": "Intermediate",
            "conversation_length": 6,
            "learning_outcome": "Understood average and worst-case complexities"
        },
        {
            "user_id": "he@gmail.com",
            "question": "How do hash tables work?",
            "question_topic": "Data Structures",
            "difficulty_level": "Intermediate",
            "conversation_length": 5,
            "learning_outcome": "Learned hash table mechanics and collision resolution"
        },
        {
            "user_id": "headstarteruser@mail.com",
            "question": "What is dynamic programming?",
            "question_topic": "Algorithm Design",
            "difficulty_level": "Advanced",
            "conversation_length": 9,
            "learning_outcome": "Understood core dynamic programming principles"
        },
        {
            "user_id": "nikster@gmail.com",
            "question": "Implement stack using array",
            "question_topic": "Data Structures",
            "difficulty_level": "Beginner",
            "conversation_length": 4,
            "learning_outcome": "Created basic stack data structure"
        },
        {
            "user_id": "sigma.6.209@gmai1.com",
            "question": "Breadth-first search explanation",
            "question_topic": "Graph Algorithms",
            "difficulty_level": "Intermediate",
            "conversation_length": 6,
            "learning_outcome": "Understood BFS traversal strategy"
        },
        {
            "user_id": "xvishwajeet.sharma23@gmai1.com",
            "question": "Red-black tree properties",
            "question_topic": "Advanced Data Structures",
            "difficulty_level": "Advanced",
            "conversation_length": 7,
            "learning_outcome": "Learned red-black tree balancing mechanisms"
        }
    ]
    
    interaction_ids = []
    for interaction in interactions:
        interaction_id = tracker.add_interaction(interaction)
        if interaction_id:
            interaction_ids.append(interaction_id)
    
    import time
    time.sleep(2)
    
    tracker.retrieve_similar_interactions("algorithms")
    tracker.get_interaction_stats()

if __name__ == "__main__":
    main()