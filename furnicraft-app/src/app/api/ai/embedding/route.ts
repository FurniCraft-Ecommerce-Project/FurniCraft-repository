import errorHandler from "@/helpers/errorHandler";
import { NextRequest, NextResponse } from "next/server";
import { cosineSimilarity } from "@/helpers/cosineSimilarity";

// Menggunakan text encoder dari model CLIP yang sama
import { textEmbeddingFunctOpenAi } from "@/helpers/textEmbedding";
import { l2Normalize } from "@/helpers/vectorNormalize";
import { adjustDimensions } from "@/helpers/adjustDimensions";


type ProductEmbeddingType = {
  _id: string;
  name: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
  embedding : number[]
};

export async function POST(request: NextRequest) {
    try {
        
        //! image embedding by imageUrl pollination
        const url = "https://text.pollinations.ai/openai";
        const {base64Image} = await request.json()
        // const question = `
        //     Analyze the uploaded image and provide detailed product recommendations based on what you see. Focus on identifying specific items, their characteristics, and suggest related or complementary products that would be relevant for purchase.
        //     Analyze this home/interior image and suggest relevant products. Include:
        //     - Furniture and decor items visible
        //     - Style (modern, traditional, minimalist, etc.)
        //     - Color scheme and materials
        //     - Room type and function
        //     - Similar product recommendations
        //     - Complementary items for the space
        //     - Home decor search keywords
        //     just answer not asking back to me.
        //     please specify to vas, chair, and desk
        //     please convert to bahasa indonesia
        // `

        const question = `
            Please analyze this room image and provide a comprehensive furniture recommendation report. Focus on the following aspects:

            **ROOM ANALYSIS:**
            1. **Room Type Identification**: What type of room is this? (living room, bedroom, dining room, office, kitchen, bathroom, etc.)

            2. **Design Style Assessment**: What is the current interior design style? (modern, minimalist, traditional, industrial, scandinavian, bohemian, contemporary, etc.)

            3. **Space Evaluation**: 
            - Room size (small, medium, large)
            - Layout and traffic flow
            - Natural lighting conditions
            - Color scheme and mood

            4. **Existing Elements**: What furniture and decor items are already present?

            **FURNITURE RECOMMENDATIONS:**
            Based on your analysis, recommend specific furniture pieces that would enhance this space. For each recommendation, include:

            1. **Primary Furniture Needs** (essential items missing or needing upgrade):
            - Item type and suggested size
            - Placement location in the room
            - Style/material that would complement existing decor
            - Functional benefits

            2. **Accent Pieces** (decorative items to complete the look):
            - Vases and their ideal placement
            - Side tables or accent tables
            - Additional seating options
            - Storage solutions

            3. **Style Coordination**:
            - Color palette suggestions
            - Material recommendations (wood, metal, glass, fabric)
            - How new pieces should harmonize with existing elements

            **FORMAT YOUR RESPONSE AS:**

            ## Room Analysis
            **Room Type:** [Type]
            **Design Style:** [Style]
            **Size & Layout:** [Description]
            **Current Mood:** [Description]

            ## Furniture Recommendations

            ### Essential Pieces
            1. **[Furniture Type]**
            - **Size:** [dimensions/scale]
            - **Placement:** [where to place it]
            - **Style:** [recommended style/material]
            - **Reason:** [why this piece is needed]

            ### Accent Pieces
            1. **[Accent Type]**
            - **Placement:** [specific location]
            - **Style:** [description]
            - **Purpose:** [functional/aesthetic reason]

            ### Design Integration
            - **Color Harmony:** [color suggestions]
            - **Material Mix:** [material recommendations]
            - **Overall Impact:** [how these additions will transform the space]

            ## Shopping Priority
            List the recommendations in order of importance (most impactful first).

            Remember to consider:
            - The user's existing investment in current furniture
            - Practical functionality alongside aesthetics
            - Budget-conscious options when possible
            - How each piece contributes to the overall room harmony

            please convert to bahasa indonesia
        `

        let {textEmbed, resOpenAi} = await textEmbeddingFunctOpenAi(base64Image,question,url)
        textEmbed = l2Normalize(textEmbed)
        // textEmbed = adjustDimensions(textEmbed) // to adjust dimensions to 512, before 384 => db products for embeddingDescriptionImage
        textEmbed = adjustDimensions(textEmbed,384) // to compress dimensions to 384, before 512 => db products for embeddingDescription

        const resPE = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/all`)
        const dataResPE : ProductEmbeddingType[] = await resPE.json()

        const resSimilarity : {_id:string, sim:number, name : string, thumbnail : string, price : number, description : string, stock : number,category : string}[] = []
        dataResPE.map(el => {
            let embedDb = l2Normalize(el.embedding)
            const cSimilarity = cosineSimilarity(embedDb,textEmbed)
            resSimilarity.push({
                _id : el._id,
                sim : cSimilarity,
                name : el.name,
                thumbnail : el.thumbnail,
                price : el.price,
                description : el.description,
                stock : el.stock,
                category : el.category
            })
        })

        const responseFinal = resSimilarity.sort((a, b) => b.sim - a.sim).slice(0,10)

        return NextResponse.json({
            arrProductsRec : responseFinal,
            textOpenAi : resOpenAi
        });
            

    } catch (error) {
        console.log(error);
        
        return errorHandler(error)
    }
}